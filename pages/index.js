import Head from 'next/head';
import Image from 'next/image';
import Logo from '../assets/logo.png';
import { useState } from 'react';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
const [isGenerating, setIsGenerating] = useState(false)

const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Calling OpenAI...")
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();
  const { output } = data;
  console.log("OpenAI replied...", output.text)

  setApiOutput(`${output.text}`);
  setIsGenerating(false);
}
  const onUserChangedText = (event) => {
    console.log(event.target.value);
    setUserInput(event.target.value);
  };
  return (
    <><div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>ExplainThisCode</h1>
          </div>
          <div className="header-subtitle">
            <h2>its like having a coding genie at your service!</h2>
          </div>
        </div>
        {/* Add this code here*/}
        <div className="prompt-container">
          <textarea
            placeholder="Enter your code"
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText} />;
        </div>
      </div>
      {/* New code I added here */}
      <div className="prompt-buttons">
    <a
    className={isGenerating ? 'generate-button loading' : 'generate-button'}
    onClick={callGenerateEndpoint}
  >
    <div className="generate">
    {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
    </div>
  </a>
  <button className="generate-button clear-prompt" onClick={() => setUserInput('')}>
    Clear Prompt
  </button>  
</div>
      {/* New code I added here */}
  {apiOutput && (
  <div className="output">
    <div className="output-header-container">
      <div className="output-header">
        <h3>this is what that code sample does.....</h3>
      </div>
    </div>
    <div className="output-content">
      <p>{apiOutput}</p>
    </div>
  </div>
)}
</div>
    <div className="badge-container grow">
        <a
          href="https://twitter.com/rigneyl"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={Logo} alt="logo" />
            <p>built by luke</p>
          </div>
        </a>
      </div></>
      );
};

export default Home;
