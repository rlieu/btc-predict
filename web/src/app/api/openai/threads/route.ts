import { NextRequest, NextResponse } from "next/server";
import { getThreadsByUser } from "@/utils/database";
import { ThreadInput } from "@/utils/types";
import { createThread } from "@/utils/openai";

export async function GET(request: NextRequest) {
  const userId = Number(request.nextUrl.searchParams.get('userId'));
  const { threads } = await getThreadsByUser({ userId });

  return NextResponse.json(threads);
}

export async function POST(request: Request) {
  const { userId } = await request.json() as ThreadInput;

  const { thread } = await createThread({ userId });

  return NextResponse.json(thread);
}
