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

  console.log(prompt);

  const payload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 700,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;

// const generateAction = async (req, res) => {
//   // Run first prompt

//   let inp = `Generate a workout routine tailored towards ${req.body.userInput.hasGoal}. The exercises should use ${req.body.userInput.hasGym}.\nMake sure workouts are only on ${req.body.userInput.days}.\n${req.body.userInput.pref}\nGive the number of reps and sets if appropriate.\nreturn text in markdown format`;
//   console.log(inp)

//   const baseCompletion = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt: inp,
//     temperature: 0.7,
//     max_tokens: 700,
//   });
  
//   const basePromptOutput = baseCompletion.data.choices.pop();

//   res.status(200).json({ output: basePromptOutput });
// };

// export default generateAction;

//${req.body.userInput}
//days.join(', ')