import os
import pathlib
import agentql
from playwright.sync_api import sync_playwright
from dotenv import load_dotenv

load_dotenv()

os.environ.get("AGENTQL_API_KEY")

INITIAL_URL = os.environ.get("PAGE_URL")

PRICES_QUERY = """
{
    cryptocurrency_prices[] {
        name
        price
        change_24h
        volume_24h
        market_cap
    }
}
"""

def save_current_prices(url=None):
  try:
    with sync_playwright() as playwright, playwright.chromium.launch(headless=False) as browser:
      context = browser.new_context(
        user_agent=os.environ.get("USER_AGENT")
      )

      page = agentql.wrap(context.new_page())

      page_url = url if url != None else INITIAL_URL
      page.goto(page_url)

      response = page.query_data(PRICES_QUERY)
      print(response)

      csv_dir = pathlib.Path().parent.joinpath("./data/price_data.csv")

      with open(csv_dir, "w", encoding="utf-8") as file:
        file.write("Name, Price, 24H Change, 24H Volume, Market Cap\n")
        for item in response["cryptocurrency_prices"]:
          file.write(f"{item["name"]},{item["price"]},{item["change_24h"]},{item["volume_24h"],{item["market_cap"]}}\n")

      return response
  except Exception as e:
    print(e)
    return "Error saving current price data."