import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';
import { useState } from 'react';

const Home = () => {


  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [days, setDays] = useState([]);
  const [hasGym, setHasGym] = useState(false);
  const [hasGoal, setHasGoal] = useState('');
  const [submitted, setSubmitted] = useState('');

  const handleDayChange = event => {
    const { value } = event.target;
    setDays(days => [...days, value]);
  };

  const handleGymChange = event => {
    const { value } = event.target;
    setHasGym(value);
  };

  const handleGoalChange = event => {
    const { value } = event.target;
    setHasGoal(value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    // Submit the form data somewhere
    setSubmitted(true);
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);
    const formData = {
      days,
      hasGym,
      hasGoal,
    } 
    console.log("Calling OpenAI...")
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: formData }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text)

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
  }


  function FormDataTable({ days, hasGym, hasGoal }) {
    return (
      <table>
        <tr>
          <th>Available Days</th>
          <td>
            {days.join(', ')}
          </td>
        </tr>
        <tr>
          <th>Gym Equipment</th>
          <td>
            {hasGym}
          </td>
        </tr>
        <tr>
          <th>Goal</th>
          <td>
            {hasGoal}
          </td>
        </tr>
      </table>
    );
  }
  
  return (
    <div className="root">
      <Head>
        <title>Find Your Fit</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Find Your Fit</h1>
          </div>
          <div className="header-subtitle">
            <h2>Tell us your fitness goals, preferences and weekly availability. </h2>
            <h2>Get a personalised workout plan that fits your needs.</h2>
          </div>
        </div>
        <div className="prompt-container">
          <form onSubmit={handleSubmit}>
            <label>
              
              <p className='questions' >Select the days you are available to workout:</p>

              <input type="checkbox" value="Monday" onChange={handleDayChange} /> Monday
              <br />
              <input type="checkbox" value="Tuesday" onChange={handleDayChange} /> Tuesday
              <br />
              <input type="checkbox" value="Wednesday" onChange={handleDayChange} /> Wednesday
              <br />
              <input type="checkbox" value="Thursday" onChange={handleDayChange} /> Thursday
              <br />
              <input type="checkbox" value="Friday" onChange={handleDayChange} /> Friday
              <br />
              <input type="checkbox" value="Saturday" onChange={handleDayChange} /> Saturday
              <br />
              <input type="checkbox" value="Sunday" onChange={handleDayChange} /> Sunday
            </label>
            <br />
            <br />
            <label>
              <p className='questions'>Do you have access to Gym Equipment?</p>
              
              <input type="radio" name="gym" value="Gym Equipment" onChange={handleGymChange} /> Yes
              <br />
              <input type="radio" name="gym" value="No Gym Equipment" onChange={handleGymChange} /> No
            </label>
            <br />
            <br />
            <label>
              <p className='questions'>Which of these is your main Fitness Goal at the moment?</p>
      
              <input type="radio" name="goal" value="losing weight" onChange={handleGoalChange} /> Losing weight: This is a common goal for people who are looking to shed excess body fat and improve their body composition.
              <br />
              <br />
              <input type="radio" name="goal" value="building muscle" onChange={handleGoalChange} /> Building muscle: This goal is often pursued by people who want to increase their strength and improve their muscle definition.
              <br />
              <br />
              <input type="radio" name="goal" value="improving cardiovascular endurance" onChange={handleGoalChange} /> Improving cardiovascular endurance: This goal involves increasing the body's ability to sustain physical activity for an extended period of time, such as running a marathon or participating in a triathlon.

            </label>
            <br />
            <br />
            {/* <button type="submit">Submit</button>
            {submitted && <FormDataTable days={days} hasGym={hasGym} hasGoal={hasGoal} />} */}
          </form>
          
          <div className="prompt-buttons">
            <a
              className={isGenerating ? 'generate-button loading' : 'generate-button'}
              onClick={callGenerateEndpoint}
            >
              <div className="generate">
              {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
              </div>
            </a>
            
          </div>
          
        </div>
        {apiOutput && (
          <div className="output">
            <div className="output-header-container">
              <div className="output-header">
                <h3>Output</h3>
              </div>
            </div>
            <div className="output-content">
              <p  className="urdu-text" >{apiOutput}</p>
            </div>
          </div>
          )}
      </div>

      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>build with buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
