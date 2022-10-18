import * as React from "react";
import { Component } from "react";
import { SelectOptionGroup } from "@mui/base";
import {
  Button,
  StepLabel,
  Stepper,
  Step,
  Box,
  Typography,
} from "@mui/material";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

// Made for the poll questions and the live results

// Steps Should Be Questions (Retrieve from DB);
const steps = [];

// Question Answers should be taken from DB 
const answers = [
   "Fortnite",
   "Valorant",
   "COD: Warzone",
   "None"
  ];

const questions = [
  "What game do you play the most?",
  "Which game would you say is the most competitive?",
  "If you could only play one, which would it be?"
];

questions.forEach((question) => {
  steps.push('Question '+ questions.indexOf(question));
})

// Object to store answer Choices ( needs function once next is selected or finish is selected)
const results = {
  "Fortnite": 0,
  "Valorant": 0,
  "COD: Warzone": 0,
  "None": 0
}

// Submission should take all answers and append them to the individual results to the DB as a new record allowing redundancy

function Questionnaire() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState(null);
  // Created to control the selections of from the Poll and record the state of selections per question
  // Array used for ease of reset and back tracking in poll
  const [selections, setSelections] = React.useState([]);

  const handleNext = () => {
    // Used to move the user to the next question
    setActiveStep((prevActiveStep) => prevActiveStep + 1);

    // We are Recording the selection and then setting whats currently selected to null
    // Copy created for state update tp prevent a shallow merge on the selection array
    let current = selections;
    current.push(value);
    setSelections(current);
    setValue(null);

    // If the poll questions reach the end, start to compile the results
    if(activeStep === steps.length - 1){
      compilePollResults();
    }

  };

  const handleBack = () => {
    // Used to move the user to the previous question
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    let current = selections;

    // Removing the last choice from the selection array. Questions are essentially in a stack order and so is the selection array.
    current.pop();
    setSelections(current);
    setValue(null);
  };

  const handleReset = () => {
    // Making sure we reset the values of the entire poll if the entire form is reset
    setActiveStep(0);
    setSelections([]);
    setValue(null);
    
  };

  // Storing the current selection of the poll
  const handleChange = (event) => {
    setValue(event.target.value);
  }

  // Compile data for DB submission
  const compilePollResults = () => {
    Object.keys(results).forEach((pick) => {
      results[pick] = selections.filter((selection) => selection == pick).length;
    })
    console.log(results);
   
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you&apos;re finished
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">{questions[activeStep]}</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              onChange={handleChange}
              value={value}
            >
              <FormControlLabel
                value={answers[0]}
                control={<Radio />}
                label={answers[0]}
              />
              <FormControlLabel value={answers[1]} control={<Radio />} label={answers[1]} />
              <FormControlLabel
                value={answers[2]}
                control={<Radio />}
                label={answers[2]}
              />
              <FormControlLabel value={answers[3]} control={<Radio />} label={answers[3]} />
            </RadioGroup>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext} disabled={value === null}>
              {activeStep === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
export default Questionnaire;

// Due to ideally rapidly changing data we will load the pages at request time rather than build time
export async function getServerSideProps() {
  React.useEffect();
  // Fetch
  // Example
  const response = await fetch('/some-api');
  const data = await req.json();

    return {
        props: {data},
    }
}

export function Car ({car}) {
  return <h1>{car.make}</h1>
}
