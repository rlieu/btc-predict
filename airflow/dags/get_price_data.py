import datetime
import pendulum
import sys
sys.path.append("../plugins")

from coinmarketcap import save_historical_price
from airflow.decorators import dag, task
from airflow.providers.common.sql.operators.sql import SQLExecuteQueryOperator
from airflow.providers.postgres.hooks.postgres import PostgresHook


@dag(
    dag_id="get_price_data",
    schedule_interval="0 0 * * *", # daily at midnight
    start_date=pendulum.datetime(2025, 1, 1, tz="UTC"),
    catchup=False,
    dagrun_timeout=datetime.timedelta(minutes=60),
)
def GetPriceData():
    create_prices_table = SQLExecuteQueryOperator(
        task_id="create_prices_table",
        conn_id="pg_conn",
        sql="""
            CREATE TABLE IF NOT EXISTS prices (
                "id" SERIAL PRIMARY KEY,
                "percent_change_1h" NUMERIC,
                "percent_change_24h" NUMERIC,
                "percent_change_7d" NUMERIC,
                "percent_change_30d" NUMERIC,
                "price" NUMERIC,
                "volume_24h" NUMERIC,
                "market_cap" NUMERIC,
                "total_supply" NUMERIC,
                "circulating_supply" NUMERIC,
                "timestamp" TIMESTAMP WITH TIME ZONE,
                "symbol" TEXT,
                CONSTRAINT unique_timestamp_symbol UNIQUE (timestamp, symbol)
            );""",
    )

    create_prices_temp_table = SQLExecuteQueryOperator(
        task_id="create_prices_temp_table",
        conn_id="pg_conn",
        sql="""
            DROP TABLE IF EXISTS prices_temp;
            CREATE TABLE prices_temp (
                "id" SERIAL PRIMARY KEY,
                "percent_change_1h" NUMERIC,
                "percent_change_24h" NUMERIC,
                "percent_change_7d" NUMERIC,
                "percent_change_30d" NUMERIC,
                "price" NUMERIC,
                "volume_24h" NUMERIC,
                "market_cap" NUMERIC,
                "total_supply" NUMERIC,
                "circulating_supply" NUMERIC,
                "timestamp" TIMESTAMP WITH TIME ZONE,
                "symbol" TEXT
            );""",
    )

    @task
    def get_data():
        save_historical_price(symbol="ETH", interval="1h", count=24)

        postgres_hook = PostgresHook(postgres_conn_id="pg_conn")
        conn = postgres_hook.get_conn()
        cur = conn.cursor()
        with open("./quotes_ETH.csv", "r") as file:
            cur.copy_expert(
                "COPY prices_temp FROM STDIN WITH CSV HEADER DELIMITER AS ',' QUOTE '\"'",
                file,
            )
        conn.commit()

    @task
    def merge_data():
        query = """
            INSERT INTO prices
                (percent_change_1h,
                percent_change_24h,
                percent_change_7d,
                percent_change_30d,
                price,
                volume_24h,
                market_cap,
                total_supply,
                circulating_supply,
                timestamp,
                symbol)
            SELECT
                percent_change_1h,
                percent_change_24h,
                percent_change_7d,
                percent_change_30d,
                price,
                volume_24h,
                market_cap,
                total_supply,
                circulating_supply,
                timestamp,
                symbol
            FROM prices_temp
            ON CONFLICT ("timestamp","symbol") DO NOTHING;
        """
        try:
            postgres_hook = PostgresHook(postgres_conn_id="pg_conn")
            conn = postgres_hook.get_conn()
            cur = conn.cursor()
            cur.execute(query)
            conn.commit()
            return 0
        except Exception as e:
            print(e)
            return 1

    [create_prices_table, create_prices_temp_table] >> get_data() >> merge_data()


dag = GetPriceData()