import { NextRequest, NextResponse } from "next/server";
import { createMessage, createRunStream } from "@/utils/openai";
import { getMessagesByThread } from "@/utils/database";
import { MessageInput } from "@/utils/types";

export async function GET(request: NextRequest) {
  const threadId = Number(request.nextUrl.searchParams.get('threadId'));

  const { messages } = await getMessagesByThread({ threadId });

  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  const { userInput, assistantId, threadId, userId } = await request.json() as MessageInput;

  await createMessage({ userInput, assistantId, threadId, userId });
  await createRunStream({ assistantId, threadId, userId });
  const { messages } = await getMessagesByThread({ threadId });

  return NextResponse.json(messages);
}
