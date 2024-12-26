import { User, Assistant, Thread, Message, Run } from '@/models';
import { MessageInput, RunInput, ThreadInput } from './types';
import { AssistantModel } from '@/models/assistants';
import { ThreadModel } from '@/models/threads';
import { openai } from '@/app/api/openai/services/openai';

export const createThread = async ({ userId }: ThreadInput) => {
  let error;
  let thread;
  let user;

  try {
    // create thread in Openai and save it's id to be put into the db
    const t = await openai.beta.threads.create();
    const openai_id = t.id;

    // if successful create an internal record that belongs to a user
    // get the user id and user
    user = await User.findByPk(userId); // TODO convert to DynamoDB 
    thread = await Thread.create({
      openai_id,
      thread_name: new Date().toLocaleString(),
      user_id: user?.id as number
    });
  } catch (e) {
    error = `Error creating thread: ${JSON.stringify(e)}`;
    throw e;
  }
  return { error, thread, user };
};

// Now messages need to be posted to threads and runs need to be created
// Create a message
export const createMessage = async ({ userInput, assistantId, threadId, userId }: MessageInput) => {
  let error;
  let thread;
  let message;

  try {
    // get user by id and thread by id, both passed in through the url
    thread = await Thread.findOne({ where: { id: threadId, user_id: userId } });

    // create message on openai with thread_id 
    const m = await openai.beta.threads.messages.create(
      thread?.openai_id as string,
      { role: "user", content: userInput as string }
    );
    console.log(m);
    console.log(JSON.stringify(m.content))

    // create message in local db
    message = await Message.create(
      {
        openai_id: m.id,
        thread_id: thread?.id as number,
        role: m.role,
        assistant_id: assistantId as number,
        content: userInput as string
      }
    );
  } catch (e) {
    error = `Error creating message: ${JSON.stringify(e)}`;
    throw e;
  }
  return { error, thread, message };
};

// this is where we get the list of messages sent back from the openid assistant
// the messages should display the run id and the assistant id
// this could possibly be a put model, it would modify a thread, adding the retrieved messages to the local db
// let's do that in a different call
/*
router.get('/users/:userId/threads/:threadId/messages', async (req, res) => {
  try {
  const { userId, threadId } = req.params;

  //User is not in the message Model, but it is in the thread Model. 
  //It should be used to validate the Data. The thread must belong to the specific
  //user.
  const messages = await Message.findAll({ where: { thread_id: threadId } });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});
*/


// retrieve messages from openai for a particular thread
export const getMessagesByThread = async ({ userId, threadId }: MessageInput) => {
  let error;
  let thread;
  let messages;

  try {
    thread = await Thread.findOne({
      where: { user_id: userId, id: threadId }
    });

    // retrieve the messages with the openai_id from the thread
    messages = await openai.beta.threads.messages.list(thread?.openai_id as string);
  } catch (e) {
    error = `Error fetching messages: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, thread, messages };
};

// now to run the message
// create a run
export const createRunStream = async ({ userId, threadId, assistantId }: RunInput) => {
  let error;
  let assistant: AssistantModel | null;
  let thread: ThreadModel | null;
  let run;
  let message;

  // start by getting the thread openai_id
  try {
    // get user by id and thread by id, both passed in through the url
    const user = await User.findByPk(userId)

    thread = await Thread.findOne({
      where: { user_id: user?.id, id: threadId }
    });

    // get assistant, passed in as a body parameter
    assistant = await Assistant.findByPk(assistantId);

    // create the run with openai
    const r = await openai.beta.threads.runs.stream(
      thread?.openai_id as string,
      { assistant_id: assistant?.openai_id as string }
    ).on('runStepCreated', async (runStep) => {
      // record the run in the local db
      run = await Run.create(
        {
          openai_id: runStep.id,
          thread_id: thread?.id as number,
          assistant_id: assistant?.id as number,
        }
      );
    }).on('textDone', async (content, msg) => {
      message = await Message.create(
        {
          openai_id: msg.id,
          thread_id: thread?.id as number,
          role: msg.role,
          assistant_id: assistantId as number,
          content: content.value
        }
      );
    }).done();
    console.log(r);

  } catch (e) {
    error = `Error creating run: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, assistant, thread, run, message };
};

// get a list of runs for a thread
export const getRunsByThread = async ({ threadId }: RunInput) => {
  let error;
  let thread;
  let runs;

  try {
    thread = await Thread.findByPk(threadId);
    runs = await openai.beta.threads.runs.list(
      thread?.openai_id as string
    );

  } catch (e) {
    error = `Error fetching runs: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, thread, runs };
};

// get specific run for a thread
// this was hardcoded
// really we probably don't need to get the runs so much as the messages that are related to the runs.
export const getRunByThread = async ({ runId, threadId, userId }: RunInput) => {
  let error;
  let thread;
  let run;
  let runAI;
  let user;

  try {
    // get user by id and thread by id, both passed in through the url
    // this is an inefficient set of queries, it could be improved
    // but now it's doing what I want, I think.
    // get user
    user = await User.findByPk(userId)
    // get thread, make sure it belongs to the user
    thread = await Thread.findOne({
      where: { user_id: user?.id, id: threadId }
    });
    // use the thread id that has already been checked by user
    // use the run id that is in the url
    run = await Run.findOne({
      where: { id: runId, thread_id: thread?.id }
    })

    // this seems to be creating new records in the database, I don't want that
    // try this with hardcoded data
    runAI = await openai.beta.threads.runs.retrieve(
      thread?.openai_id as string,
      run?.openai_id as string
    );

  } catch (e) {
    error = `Error fetching run: ${JSON.stringify(e)}`;
    throw e;
  }

  return { error, thread, run, runAI, user };
};

export const createCompletion = async ({ userInput, assistantId, threadId, userId }: RunInput) => {
  let error;
  let completion;
  let thread;
  let message;

  try {
    // get user by id and thread by id, both passed in through the url
    thread = await Thread.findOne({ where: { id: threadId, user_id: userId } });

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: userInput as string }],
    });

    completion = response.choices[0].message;
    console.log(`Reply: ${JSON.stringify(completion)}`);

    // create message in local db
    message = await Message.create(
      {
        openai_id: response.id,
        thread_id: thread?.id as number,
        role: 'ai',
        assistant_id: assistantId as number,
        content: completion.content as string
      }
    );
  } catch (e) {
    error = `Error creating completion: ${JSON.stringify(e)}`;
    throw e;
  }
  return { error, completion, thread, message };
};
