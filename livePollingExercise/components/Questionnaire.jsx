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


// Using a different method for poll result insertion to utilize the api key protection of the DB Data API and prevent SQL injection

// Submission should take all answers and append them to the individual results to the DB as a new record allowing redundancy

function Questionnaire({ pollData }) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [value, setValue] = React.useState(null);

  // Created to control the selections of from the Poll and record the state of selections per question
  // Array used for ease of reset and back tracking in poll
  const [selections, setSelections] = React.useState({});
  const steps = [];

  // Object to store answer Choices ( needs function once next is selected or finish is selected)
  let results = {};

  pollData[0].questions.forEach((question) => {
    steps.push("Q" + `${pollData[0].questions.indexOf(question) + 1}`);
    results[`question${pollData[0].questions.indexOf(question) + 1}`] = null;
  });

  const handleNext = () => {
    // Used to move the user to the next question
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    let currentSelection = `question${activeStep + 1}`;
    results[`question${activeStep + 1}`] = value;

    // We are Recording the selection and then setting whats currently selected to null
    // Copy created for state update tp prevent a shallow merge on the selection array
    let current = selections;
    current[`question${activeStep + 1}`] = value;
    setSelections(current);
    setValue(null);

    // If the poll questions reach the end, start to compile the results
    if (activeStep === steps.length - 1) {
      compilePollResults();
    }
  };

  const handleBack = () => {
    // Used to move the user to the previous question
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    let current = selections;

    // Removing the last choice from the selection array. Questions are essentially in a stack order and so is the selection array.
    delete current[`question${activeStep}`];
    console.log(selections);
    setSelections(current);
    setValue(null);
  };

  const handleReset = () => {
    // Making sure we reset the values of the entire poll if the entire form is reset
    setActiveStep(0);
    setSelections({});
    setValue(null);
  };

  // Storing the current selection of the poll
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Compile data for DB submission

  // Making API call to DB to INSERT New record for Polling Data.
  const compilePollResults = async () => {
    console.log(selections);
    const response = await fetch(process.env.POLL_INSERT_API
      , {
      method: "POST",
      body: JSON.stringify(selections),
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
        "api-key": process.env.API_KEY,
      },
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <Box
        style={{
          padding: "10px",
          border: "solid 2px black",
          // color: "white",
          borderRadius: "5px",
          minHeight: "400px",
          minWidth:"500px",
          textAlign: "center"
        }}
        sx={{ minWidth: "100%" , minHeight:'100px'}}
      >
        <Stepper style={{padding:"15px"}}activeStep={activeStep}>
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
              All questions answered - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography
              style={{ textAlign: "center", fontWeight: "bold" }}
              sx={{ mt: 2, mb: 1 }}
            >
              Question {activeStep + 1}
            </Typography>
            <FormControl >
              <FormLabel id="demo-radio-buttons-group-label">
                {pollData[0].questions[activeStep]}
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                onChange={handleChange}
                value={value}
              >
                <FormControlLabel
                  value={pollData[0].answers[0]}
                  control={<Radio />}
                  label={pollData[0].answers[0]}
                />
                <FormControlLabel
                  value={pollData[0].answers[1]}
                  control={<Radio />}
                  label={pollData[0].answers[1]}
                />
                <FormControlLabel
                  value={pollData[0].answers[2]}
                  control={<Radio />}
                  label={pollData[0].answers[2]}
                />
                <FormControlLabel
                  value={pollData[0].answers[3]}
                  control={<Radio />}
                  label={pollData[0].answers[3]}
                />
              </RadioGroup>
            </FormControl>
            <Box sx={{ paddingTop:"20px",display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
                variant="outlined"
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />

              <Button variant="contained" onClick={handleNext} disabled={value === null}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </div>
  );
}
export default Questionnaire;
