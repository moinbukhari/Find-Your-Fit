import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
  // Run first prompt
  console.log(`Generate a workout routine tailored towards ${req.body.userInput.hasGoal}. The exercises should use ${req.body.userInput.hasGym}.\nMake sure workouts are only on ${req.body.userInput.days}.\n${req.body.userInput.pref}\nGive the number of reps and sets if appropriate.`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: 
    `Generate a workout routine tailored towards ${req.body.userInput.hasGoal}. The exercises should use ${req.body.userInput.hasGym}.\nMake sure workouts are only on ${req.body.userInput.days}.\n${req.body.userInput.pref}\nGive the number of reps and sets if appropriate.\nSplit each day with a line of *********************`,
    temperature: 0.7,
    max_tokens: 500,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;

//${req.body.userInput}
//days.join(', ')