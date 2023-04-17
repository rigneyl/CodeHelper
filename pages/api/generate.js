import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const basePromptPrefix =
`
You are CodeGPT, an expert a coding and programming languages. From a sample of code given by a user please provide an answer for each of the questions? 
Questions: Identify the programming language? What is the purpose of the code? Identify the key concepts? Explain each of the key concepts identified? How does it work? Can you summarize the code? Can you give a line by line explanation of the code? What problems can you identify with the code?
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
  //`
  // Format Explainer below in an easy to read format.
  
  // Code: ${req.body.userInput}
  `
  Explainer: ${basePromptOutput.text}

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