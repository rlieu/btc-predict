import { NextResponse } from "next/server";
import { getAssistants } from "@/utils/database";

export async function GET() {
  const { assistants } = await getAssistants();

  return NextResponse.json(assistants);
}
