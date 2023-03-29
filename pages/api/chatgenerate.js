import { Configuration, OpenAIApi } from 'openai';


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
  
const openai = new OpenAIApi(configuration);


const generateAction = async (req, res) => {
    // Run first prompt

    // let inp = `Generate a workout routine tailored towards ${req.body.userInput.hasGoal}. The exercises should use ${req.body.userInput.hasGym}.\nMake sure workouts are only on ${req.body.userInput.days}.\n${req.body.userInput.pref}\nGive the number of reps and sets if appropriate.\nreturn text in markdown format`;
    // console.log(inp)
    console.log("HIIII");
    const baseCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
                    {"role": "system", "content": "You are an professional personal trainer that is an expert in health and fitness. You help people lose weight, get in shape and improve their health."},
                    {"role": "user", "content": "Hi, can you generate a workout plan for me."},
                    {"role": "assistant", "content": "Sure, tell me what your availability, goals and preferences."},
                    {"role": "user", "content": "Generate a workout plan tailored towards building muscle. The exercises should use gym equipment. Make sure workouts are only 1 hour long and are only on weekdays. Must add warmup exercises at the beginning for 5 minutes if weights are being used. The workout plan must take into account that exercises are split by muscle groups. Give the number of reps and sets if appropriate. Give a detailed purpose of each workout day at the end section for that day."}
                ],
      });
    // const baseCompletion = await openai.createChatCompletion({
    //     model: 'gpt-3.5-turbo',
    //     prompt: [
    //         {"role": "system", "content": "You are a helpful assistant."},
    //         {"role": "user", "content": "Who won the world series in 2020?"},
    //         {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
    //         {"role": "user", "content": "Where was it played?"}
    //     ]
    // });

    const basePromptOutput = baseCompletion.data.choices.pop();
    console.log(basePromptOutput.message.content)

    res.status(200).json({ output: basePromptOutput.message.content });
};

export default generateAction;