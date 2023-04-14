import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix =
`
I want you to act as a code explainer. Your task is to take a code sample, break it down into simpler parts, and explain each step in detail. Describe what each step does and why, and any concepts that need to be understood. Make sure to explain the problem in a way that can be understood by people with varying levels of coding expertise.
`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 1250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = 
  `
  Format the explainer to me in three parts. Part One: The first part explain to me as if I am 5. Part Two: The second part into an easy to understand answer format of a minimum 500 words. Reference the code sample when answering. Part Three: Explain the Code to me line by line.
  
  Code: ${req.body.userInput}

  Explainer: ${basePromptOutput.text}

  Easy to Understand Format:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.75,
		// I also increase max_tokens.
    max_tokens: 1800,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;