import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
  // Run first prompt

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 
    `Generate a workout routine tailored towards ${req.body.userInput.hasGoal}. The exercises should use ${req.body.userInput.hasGym}.
    Make sure workouts are only on ${req.body.userInput.days}. Give the number of reps and sets if appropriate. Give some tips at the end\n`,
    temperature: 0.7,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;

//${req.body.userInput}