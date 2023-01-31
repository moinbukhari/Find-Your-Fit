import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const regenerateAction = async (req, res) => {
  // Run first prompt

  let inp = `Improve the workout plan given in markdown format according to the suggestion.  Change only parts relevant to the comment.\nSuggestion: ${req.body.userInput}\nWorkout Plan:\n${req.body.prevContent}\nWorkout Plan:\n`;
  console.log(inp)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: inp,
    temperature: 0.8,
    max_tokens: 1500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default regenerateAction;

//${req.body.userInput}
//days.join(', ')