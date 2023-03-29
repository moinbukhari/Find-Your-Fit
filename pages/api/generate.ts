import type { NextRequest } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "../../utils/OpenAIStream";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};


const handler = async (req: NextRequest): Promise<Response> => {
  const { prompt } = (await req.json()) as {
    prompt?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }

  console.log(prompt)
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages: [
                {role: "system", content: "You are a professional personal trainer that is an expert in health and fitness. You help people lose weight, get in shape and improve their fitness."},
                {role: "user", content: prompt}
            ],
    stream: true,
    n: 1,
  };
  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;

// messages: [
//     {"role": "system", "content": "You are an professional personal trainer that is an expert in health and fitness. You help people lose weight, get in shape and improve their health."},
//     {"role": "user", "content": "Hi, can you generate a workout plan for me."},
//     {"role": "assistant", "content": "Sure, tell me what your availability, goals and preferences."},
//     {"role": "user", "content": prompt }
// ],