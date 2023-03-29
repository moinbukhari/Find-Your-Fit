import Head from "next/head";
import Image from "next/image";
import appLogo from "../assets/logo1.png";
import posthog from "posthog-js";
import mon from "../assets/Mon.png";
import tue from "../assets/Tue.png";
import wed from "../assets/Wed.png";
import thu from "../assets/Thu.png";
import fri from "../assets/Fri.png";
import sat from "../assets/Sat.png";
import sun from "../assets/Sun.png";
import Link from "next/link";
import download from "downloadjs";
import { Toaster, toast } from "react-hot-toast";

import { useState, useEffect } from "react";
import { Remarkable } from "remarkable";
import NavBar from "./navbar";

export default function Gen() {
  const [apiOutput, setApiOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [days, setDays] = useState([]);
  const [hasGym, setHasGym] = useState("");
  const [hasGoal, setHasGoal] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [pref, setPref] = useState("");
  const [comment, setComment] = useState("");
  const [email, setEmail] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [editing, setEditing] = useState(false);
  const [showTextArea, setShowTextArea] = useState(false);

  const handleDayChange = (event) => {
    const { value } = event.target;
    if (event.target.checked) {
      setDays((days) => [...days, value]);
    } else {
      setDays((days) => days.filter((day) => day !== value));
    }
    //console.log(days)
  };

  // useEffect(() => {
  //   console.log(days);
  // }, [days]);

  // useEffect(() => {
  //   console.log(email);
  // }, [email]);

  useEffect(() => {
    if (showForm) {
      setCurrentStep(0);
      setDays([]);
      setPref("");
      setHasGym("");
      setHasGoal([]);
      setApiOutput("");
    }
  }, [showForm]);

  const handleGymChange = (event) => {
    const { value } = event.target;
    setHasGym(value);
  };

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
  };

  const handleGoalChange = (event) => {
    const { value } = event.target;

    if (event.target.checked) {
      setHasGoal((hasGoal) => [...hasGoal, value]);
    } else {
      setHasGoal((hasGoal) => hasGoal.filter((goal) => goal !== value));
    }
  };

  const handleChangePref = (event) => {
    setPref(event.target.value);
  };

  const handleButtonClick = () => {
    if (showTextArea) {
      setShowTextArea(false);
    } else {
      setShowTextArea(true);
    }
  };

  const handleTextAreaChange = (event) => {
    setComment(event.target.value);
  };

  const Markdown = ({ content }) => {
    const md = new Remarkable();
    const [value, setValue] = useState(content);

    const [html, setHtml] = useState(md.render(content));

    const handleChange = (event) => {
      setValue(event.target.value);

      setHtml(md.render(event.target.value));
    };
    const handleDownload = () => {
      // create a text file with the markdown content
      download(content, "workout_plan.txt", "text/plain");
      toast("Workout Downloaded", {
        icon: "🤘",
      });
      posthog.capture("Downloaded Workout");
    };

    // const handleKeyDown = (event) => {
    //   if (event.key === "Enter") {
    //     setValue(event.target.value);
    //     setApiOutput(value);
    //     setEditing(false);
    //   }
    // };

    const handleBlur = () => {
      setApiOutput(value);
      setEditing(false);
    };

    if (editing) {
      return (
        <div className="flex flex-col mb-4 w-full items-center">
          <h3 className="text-center text-lg font-normal tracking-tight">
            editing workout...
          </h3>
          <textarea
            value={value}
            onChange={handleChange}
            onBlur={handleBlur}
            className="shadow bg-white-400 bg-opacity-30 border border-gray-300 rounded-xl leading-relaxed text-sm pl-4 py-2.5 my-4 focus:outline-none focus:ring-1 focus:ring-rose-400 pr-12 placeholder:text-slate-700 w-full h-[400px] "
          />
          <button
            className="inline-block rounded-lg bg-gray-400 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-500 hover:bg-gray-500 hover:ring-gray-500 w-fit"
            onClick={() => setEditing(false)}
          >
            Save
          </button>
        </div>
      );
    }

    //const html = md.render(content)
    return (
      <div className="prose w-full flex flex-col gap-4 pb-4 items-center">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <div className="flex flex-row gap-4">
          <button
            className="inline-block rounded-lg bg-gray-400 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-500 hover:bg-gray-500 hover:ring-gray-500 w-fit"
            onClick={() => setEditing(true)}
          >
            Edit Workout
          </button>
          <button
            className="inline-block rounded-lg bg-gray-400 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-500 hover:bg-gray-500 hover:ring-gray-500 w-fit"
            onClick={handleDownload}
          >
            Download as .txt
          </button>

          <button
            className="inline-block rounded-lg bg-gray-400 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-500 hover:bg-gray-500 hover:ring-gray-500"
            onClick={() => setShowForm(true)}
          >
            Generate New Plan
          </button>
        </div>
      </div>
    );
  };

  const improveWorkout = async () => {
    setIsGenerating(true);

    console.log("Calling OpenAI...");
    const response = await fetch("/api/regenerate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: comment, prevContent: apiOutput }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);
    posthog.capture("Improved Workout");

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
    setShowTextArea(false);
    setComment("");
  };

  const callGenerateEndpoint = async () => {
    setIsGenerating(true);

    const formData = {
      days,
      hasGym,
      hasGoal,
      pref,
    };
    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInput: formData }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output.text);

    setApiOutput(`${output.text}`);
    setIsGenerating(false);
    posthog.capture("Generated Workout");
    setShowForm(false);
    setShowTextArea(false);
  };

  const generateWorkout = async (e: any) => {
    e.preventDefault();
    const prompt = `Generate a workout plan tailored towards ${hasGoal.join(
      ", "
    )}.${
      hasGym === "Gym Equipment"
        ? " I have access to gym equipment."
        : " I don't have access to any gym equipment."
    } Make sure workouts are about 1 hour long and are only on ${days.join(
      ", "
    )}. Add warmup exercises at the beginning for 5 minutes if weights are being used.${
      pref == ""
        ? ""
        : " The workout plan should be take into account these preferneces: " +
          pref
    }${
      pref.slice(-1) === "." ? "" : "."
    }\nGive the number of reps and sets if appropriate. Give a detailed purpose of each workout day at the end section for that day.
    
    \nReturn text in markdown in the following format:\nWorkout Plan:\n## {Day of the week}\n\n- *Warmup/Streching*\n- **{Exercise Name}**:\n...\n\n## {Day of the week} ...\nWorkout Plan:`;
    
    setIsGenerating(true);
    console.log("Calling OpenAI...");
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    // const data = await response.json();
    // const { output } = data;
    // console.log("OpenAI replied...", output);

    // setApiOutput(`${output}`);
    // setIsGenerating(false);
    // posthog.capture("Generated Workout");
    // setShowForm(false);
    // setShowTextArea(false);
    // console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      setShowForm(false);
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setApiOutput((prev) => prev + chunkValue);
    }

    console.log("OpenAI replied...");
    setIsGenerating(false);
    posthog.capture("Generated Workout", { Email: email });
    setShowTextArea(false);
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  //   const FormComponent = () => {

  //     return (

  //     );
  //   };

  function Analytics() {
    const html =
      "<!-- Google tag (gtag.js) -->\n<script async src=\"https://www.googletagmanager.com/gtag/js?id=G-B0HWBQ2TZD\"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-B0HWBQ2TZD');\n</script>";

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  //   flex flex-col gap-4
  return (
    <div className="bg-rose-200 flex flex-col flex-no-wrap h-screen overflow-auto p-0 relative ">
      <Head>
        <title>Find Your Fit </title>
      </Head>

      <Analytics />

      <div className="px-6 pt-6 lg:px-8 mb-6">
        <div>
          <nav
            className="flex h-9 items-center justify-between"
            aria-label="Global"
          >
            <div className="flex lg:min-w-0 lg:flex-1" aria-label="Global">
              <a href="/" className="flex -m-1.5 p-1.5 text-center ">
                <Image
                  className="h-12 w-12 rounded-full mr-1"
                  src={appLogo}
                  alt=""
                />
                <span className="font-mono tracking-tighter font-bold text-lg flex items-center text-left ">
                  Find Your Fit
                </span>
              </a>
            </div>
            <Link
              target="_blank"
              href="https://www.buymeacoffee.com/moinbukhari"
              className="bg-transparent hover:bg-yellow-500 text-yellow-700 font-semibold hover:text-white py-2 px-4 border border-yellow-500 hover:border-transparent rounded"
            >
              Buy me a Protein Shake 🥤
            </Link>
          </nav>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center justify-center relative">
        {/* <div className="">
          <div className="">
            <h1>Find Your Fit </h1>
          </div>
          <div className="">
            <h2>Tell us your fitness goals, preferences and weekly availability. </h2>
            <h2>Get a personalised workout plan that fits your needs.</h2>
          </div> px-5 mt-5
        </div> */}
        {showForm && (
          <div className="p-8 flex items-center justify-center flex-col w-full gap-6 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl mb-3">
              Create your ideal workout plan in seconds
            </h1>

            <div
              className="flex flex-col gap-8 mb-4 lg:w-4/6  md:w-5/6 sm:w-5/6
            rounded-lg bg-white shadow-md ring ring-transparent hover:ring-rose-300 p-5
            "
            >
              {/* <h3 className="md:text-2xl sm:text-xl font-bold tracking-tight sm:text-center  mb-3">
                Answer the few questions below and have your workout plan
                generated in minutes
              </h3> */}
              {currentStep == 0 && (
                <div className="flex flex-col flex-wrap gap-8 items-center">
                  <p className="mt-7 text-2xl leading-8 text-gray-600 sm:text-center">
                    Tell us your fitness goals, preferences and weekly
                    availability.
                  </p>
                  <p className=" text-2xl leading-8 text-gray-600 sm:text-center">
                    Get a personalised plan that fits your needs.
                  </p>
                  <button className="btn-custom" onClick={handleNext}>
                    Let's Go
                  </button>
                </div>
              )}
              {currentStep == 1 && (
                <div className="flex flex-col flex-wrap gap-8 items-center">
                  <h3 className="text-gray-700 font-bold text-xl sm:text-2xl ">
                    Which days would you like to workout?
                  </h3>
                  <ul className="flex flex-wrap gap-4 justify-center">
                    <label className="cursor-pointer relative ">
                      <input
                        type="checkbox"
                        value="Monday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Monday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card" src={mon} alt="" />
                        </div>
                        {/* <header className="px-2.5 py-2.5">
                          <p className="text-lg font-bold tracking-wide text-gray-700">
                            Monday
                          </p>
                        </header> */}
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="checkbox"
                        value="Tuesday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Tuesday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={tue} alt="" />
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="checkbox"
                        value="Wednesday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Wednesday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={wed} alt="" />
                        </div>
                        {/* <header className="px-2.5 py-2.5">
                          <p className="text-lg font-bold tracking-wide text-gray-700">
                            Wednesday
                          </p>
                        </header> */}
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="checkbox"
                        value="Thursday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Thursday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={thu} alt="" />
                        </div>
                        {/* <header className="px-2.5 py-2.5">
                          <p className="text-lg font-bold tracking-wide text-gray-700">
                            Thursday
                          </p>
                        </header> */}
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="checkbox"
                        value="Friday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Friday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={fri} alt="" />
                        </div>
                        {/* <header className="px-2.5 py-2.5">
                          <p className="text-lg font-bold tracking-wide text-gray-700">
                            Friday
                          </p>
                        </header> */}
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="checkbox"
                        value="Saturday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Saturday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card" src={sat} alt="" />
                        </div>
                        {/* <header className="px-2.5 py-2.5">
                          <p className="text-lg font-bold tracking-wide text-gray-700">
                            Saturday
                          </p>
                        </header> */}
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="checkbox"
                        value="Sunday"
                        className="peer sr-only"
                        onChange={handleDayChange}
                        checked={days.includes("Sunday")}
                      />
                      <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={sun} alt="" />
                        </div>
                        {/* <header className="px-2.5 py-2.5">
                          <p className="text-lg font-bold tracking-wide text-gray-700">
                            Sunday
                          </p>
                        </header> */}
                      </div>
                    </label>
                  </ul>
                  <button className="btn-custom" onClick={handleNext}>
                    Next
                  </button>
                </div>
              )}

              {currentStep == 3 && (
                <div className="flex flex-col flex-wrap gap-4 items-center">
                  <h3 className="text-gray-700 font-bold text-xl sm:text-2xl ">
                    Do you have access to Gym Equipment?
                  </h3>
                  <ul className="flex flex-wrap gap-4">
                    <label className="cursor-pointer ">
                      <input
                        type="radio"
                        name="gym"
                        value="Gym Equipment"
                        className="peer sr-only"
                        onChange={handleGymChange}
                        checked={hasGym === "Gym Equipment"}
                      />
                      <div className="w-30 max-w-xl p-5 bg-white text-gray-700 rounded-md hover:shadow-md ring-2 ring-gray-200 peer-checked:ring-rose-400 peer-checked:ring-offset-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold uppercase">Yes</p>
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer ">
                      <input
                        type="radio"
                        name="gym"
                        value="No Gym Equipment"
                        className="peer sr-only"
                        onChange={handleGymChange}
                        checked={hasGym === "No Gym Equipment"}
                      />
                      <div className="w-30 max-w-xl p-5 bg-white text-gray-700 rounded-md hover:shadow-md ring-2 ring-gray-200 peer-checked:ring-rose-400 peer-checked:ring-offset-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold uppercase text-gray-700">
                            No
                          </p>
                        </div>
                      </div>
                    </label>
                  </ul>
                  <div className="flex gap-5 flex-row justify-between w-full">
                    <button className="btn-gray" onClick={handlePrev}>
                      Prev
                    </button>
                    <button className="btn-custom" onClick={handleNext}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentStep == 2 && (
                <div className="flex flex-col flex-wrap gap-4 items-center">
                  <h3 className="text-gray-700 font-bold text-xl sm:text-2xl ">
                    What specific goals do you have in mind that you would like
                    to achieve?
                  </h3>
                  <ul className="flex flex-wrap gap-4 justify-center">
                    <label className="cursor-pointer ">
                      <input
                        type="checkbox"
                        name="goal"
                        value="Losing Weight"
                        className="peer sr-only"
                        onChange={handleGoalChange}
                        checked={hasGoal.includes("Losing Weight")}
                      />
                      {/* <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={lose} alt="" />
                        </div>
                        <header className="px-2 py-2">
                          <p className="text-lg font-semibold tracking-wide text-gray-700">
                            Lose
                          </p>
                          <p className="text-lg font-semibold tracking-wide text-gray-700">
                            Weight
                          </p>
                        </header>
                      </div> */}
                      <div className="w-60 max-w-xl p-5 bg-white text-gray-700 rounded-md hover:shadow-md ring-2 ring-gray-200 peer-checked:text-rose-600 peer-checked:ring-rose-400 peer-checked:ring-offset-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center">
                            <p className="text-sm font-semibold uppercase text-gray-700 text-center">
                              Losing weight
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <p>
                              This is a common goal for people who are looking
                              to shed excess body fat and improve their body
                              composition.
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer ">
                      <input
                        type="checkbox"
                        name="goal"
                        value="Building Muscle"
                        className="peer sr-only"
                        onChange={handleGoalChange}
                        checked={hasGoal.includes("Building Muscle")}
                      />
                      {/* <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card " src={muscle} alt="" />
                        </div>
                        <header className="px-2 py-2">
                          <p className="text-lg font-semibold tracking-wide text-gray-700">
                            Build 
                          </p>
                          <p className="text-lg font-semibold tracking-wide text-gray-700">
                            Muscle
                          </p>
                        </header>
                      </div> */}
                      <div className="w-60 max-w-xl p-5 bg-white text-gray-700 rounded-md hover:shadow-md ring-2 ring-gray-200 peer-checked:text-rose-600 peer-checked:ring-rose-400 peer-checked:ring-offset-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center">
                            <p className="text-sm font-semibold uppercase text-gray-700">
                              Building muscle
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <p>
                              This goal is often pursued by people who want to
                              increase their strength and improve their muscle
                              definition.
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="goal"
                        value="Improving cardiovascular endurance"
                        className="peer sr-only"
                        onChange={handleGoalChange}
                        checked={hasGoal.includes(
                          "Improving cardiovascular endurance"
                        )}
                      />
                      {/* <div className="overflow-hidden rounded-lg bg-white shadow-md ring ring-transparent grayscale transition-all active:scale-95 peer-checked:ring-rose-400 peer-checked:grayscale-0">
                        <div>
                          <Image className="day-card" src={cardio} alt="" />
                        </div>
                        
                        <p className="text-lg font-semibold tracking-wide text-gray-700">
                          Improve
                        </p>
                        <p className="text-lg font-semibold tracking-wide text-gray-700">
                          Endurance
                        </p>
                        
                      </div> */}
                      <div className="w-60 max-w-xl p-5 bg-white text-gray-700 rounded-md hover:shadow-md ring-2 ring-gray-200 peer-checked:text-rose-600 peer-checked:ring-rose-400 peer-checked:ring-offset-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center">
                            <p className="text-sm font-semibold uppercase text-gray-700">
                              Improving endurance
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <p>
                              This goal involves increasing the body's ability
                              to sustain physical activity for an extended
                              period of time, such as running a marathon.
                            </p>
                          </div>
                        </div>
                      </div>
                    </label>

                    {/* <label className="cursor-pointer">
                      <input
                        type="checkbox"
                        name="goal"
                        value="Maintaining Health"
                        className="peer sr-only"
                        onChange={handleGoalChange}
                        checked={
                          hasGoal.includes("Maintaining Health")
                        }
                      />
                  
                      <div className="w-60 max-w-xl p-5 bg-white text-gray-700 rounded-md hover:shadow-md ring-2 ring-gray-200 peer-checked:text-rose-600 peer-checked:ring-rose-400 peer-checked:ring-offset-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-center">
                            <p className="text-sm font-semibold uppercase text-gray-700">
                              Maintaining Health
                            </p>
                          </div>
                          <div className="flex items-end justify-between">
                            <p>
                            The purpose of this goal is to maintain overall physical fitness by participating in regular exercise. By maintaining fitness, an individual can reduce their risk of developing certain diseases, improve their overall quality of life, and increase energy levels.
                            </p>
                          </div>
                        </div>
                      </div>
                    </label> */}
                  </ul>

                  <div className="flex gap-5 flex-row justify-between w-full">
                    <button className="btn-gray" onClick={handlePrev}>
                      Prev
                    </button>
                    <button className="btn-custom" onClick={handleNext}>
                      Next
                    </button>
                  </div>
                </div>
              )}

              {currentStep == 4 && (
                <div>
                  <div className="flex flex-col flex-wrap gap-4 items-center w-full">
                    <h3 className="text-gray-700 font-bold text-xl sm:text-2xl ">
                      Add any details to tailor your workout.
                    </h3>

                    <textarea
                      className="shadow min-h-5 w-full font-medium md:w-4/6 bg-white-400 placeholder-gray-500 bg-opacity-30 border border-gray-300 rounded-xl leading-relaxed text-sm pl-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-rose-400 pr-12"
                      value={pref}
                      onChange={handleChangePref}
                      name="preferences"
                      placeholder="e.g. I want to get better at climbing."
                    />
                  </div>
                  <div className="flex gap-4 relative flex-wrap justify-center mt-3">
                    {/* <div className="flex gap-5 flex-row justify-between w-full">
                      <button className="btn-gray" onClick={handlePrev}>
                        Prev
                      </button>
                      <button className="btn-custom" onClick={handleNext}>
                        Next
                      </button>
                    </div> */}
                    <button
                      className="md:absolute btn-gray left-0"
                      onClick={handlePrev}
                    >
                      Prev
                    </button>
                    <button
                      className={
                        isGenerating
                          ? "inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700 hover:ring-rose-700 opacity-70 hover:cursor-not-allowed duration-[500ms,800ms]"
                          : "inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700 hover:ring-rose-700"
                      }
                      onClick={(e) => generateWorkout(e)}
                    >
                      <div className="outline-none flex flex-col justify-start flex-shrink-0 transform-none ">
                        {isGenerating ? (
                          <div className="flex gap-3">
                            <div className="my-auto h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                            <div className="my-auto -mx-1"> Generating... </div>
                          </div>
                        ) : (
                          <p>Generate Workout</p>
                        )}
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* {currentStep == 5 && (
                <div className="flex flex-col flex-wrap gap-4 items-center w-full relative">
                  <h3 className="text-gray-700 font-bold text-xl sm:text-2xl ">
                    Your 🔥 workout is almost ready.
                  </h3>

                  <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="mb-9 w-full"
                  >
                    <div className="mb-5">
                      <input
                        className="px-4 py-3 w-96 text-gray-500 font-medium text-center placeholder-gray-500 outline-none border border-gray-300 rounded-lg focus:ring focus:ring-rose-300"
                        id="newsletterInput1-2"
                        type="email"
                        placeholder="Enter Email to Generate Workout."
                        onChange={handleEmailChange}
                      />
                    </div>
                    <div className="flex gap-4 relative flex-wrap justify-center mt-3 ">
                      <button
                        className="md:absolute btn-gray left-0"
                        onClick={handlePrev}
                      >
                        Prev
                      </button>
                      <button
                        className={
                          isGenerating
                            ? "inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700 hover:ring-rose-700 opacity-70 hover:cursor-not-allowed duration-[500ms,800ms]"
                            : "inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700 hover:ring-rose-700"
                        }
                        type="submit"
                      >
                        <div className="outline-none flex flex-col justify-start flex-shrink-0 transform-none ">
                          {isGenerating ? (
                            <div className="flex gap-3">
                              <div className="my-auto h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                              <div className="my-auto -mx-1">
                                {" "}
                                Generating...{" "}
                              </div>
                            </div>
                          ) : (
                            <p>Generate Workout</p>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              )} */}
            </div>
          </div>
        )}

        {!showForm && (
          <>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{ duration: 2000 }}
            />

            <div className="mt-5 w-5/6 md:w-4/6">
              {/* <div className="px-2 md:px-10 lg:px-16 md:py-4 flex gap-3 items-center flex-col  w-full">
              <FormDataTable days={days} hasGym={hasGym} hasGoal={hasGoal} /> 
              
            </div> */}
              <div className="px-2 md:px-10 lg:px-16 md:py-4 w-full">
                {apiOutput && !showForm && (
                  <div className="flex flex-col items-center pt-5 mb-4 w-full">
                    <h3 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl mb-5">
                      Workout Plan
                    </h3>

                    <div className="p-5 sm:px-2 flex items-center flex-col w-3/4 mb-4 rounded-lg bg-rose-50 shadow-md ring ring-transparent hover:ring-rose-300">
                      <Markdown content={apiOutput} />
                      {/* {!editing && (
                        <div className="flex gap-4 mb-4">
                          <button
                            className="inline-block rounded-lg bg-gray-400 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-500 hover:bg-gray-500 hover:ring-gray-500"
                            onClick={() => setShowForm(true)}
                          >
                            Generate New Plan
                          </button>

                          <button
                            className="inline-block rounded-lg bg-gray-400 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-gray-500 hover:bg-gray-500 hover:ring-gray-500"
                            onClick={handleButtonClick}
                          >
                            Improve Current Plan
                          </button>
                        </div>
                      )} */}

                      {showTextArea && (
                        <div className="flex flex-col gap-5 mb-5 items-center w-full">
                          <textarea
                            className="shadow min-h-5 bg-white-400 bg-opacity-30 border border-gray-300 rounded-xl leading-relaxed text-sm pl-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-rose-400 pr-12 placeholder:text-slate-400 w-full h-20"
                            value={comment}
                            onChange={handleTextAreaChange}
                            placeholder="e.g Maximum 5 exercises each day"
                          />

                          <div className="flex flex-col flex-wrap gap-4 items-center cursor-pointer">
                            <a
                              className={
                                isGenerating
                                  ? "inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700 hover:ring-rose-700 opacity-70 hover:cursor-not-allowed duration-[500ms,800ms]"
                                  : "inline-block rounded-lg bg-rose-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-rose-600 hover:bg-rose-700 hover:ring-rose-700"
                              }
                              onClick={improveWorkout}
                            >
                              <div className="outline-none flex flex-col justify-start flex-shrink-0 transform-none ">
                                {isGenerating ? (
                                  <div className="flex gap-3">
                                    <div className="my-auto h-5 w-5  border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
                                    <div className="my-auto -mx-1">
                                      {" "}
                                      Regenerating...{" "}
                                    </div>
                                  </div>
                                ) : (
                                  <p>Regenerate Workout</p>
                                )}
                              </div>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* <div className="badge-container grow">
        <a
          href="https://twitter.com/_find_your_fit"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={appLogo} alt="app logo" />
            <p>built by Moin</p>
          </div>
        </a>
      </div> */}
    </div>
  );
}
