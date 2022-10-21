import React, { Component } from "react";
import Head from "next/head";
import { Box, InputLabel, MenuItem, FormControl,FormHelperText, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

// Made to show the results from the DB for polls

export default function LivePoll({ pollData, pollResult }) {
  const [ dataDisplay, setDataDisplay ] = React.useState("");
  const [ gridData, setGridData ] = React.useState([]);

  let menuItems = [];
  let pollStats = {};
  let qCount = 1;

  // Storing the total for creating percentages
  pollStats.totalResponses = pollResult["total"];

  // Creating Menu Items in Selection to Control Poll result data per question given
  pollData[0].questions.forEach((question) => { 
    let q = "question" + qCount;
    menuItems.push(<MenuItem value={q} index={q}>{question}</MenuItem>)
    pollStats[q] = pollResult[q];
    qCount++;
  });
  console.log("These are the polling stats so far: ", pollStats);
  
  // Creating Columns of Data grid
  const columns = [
    { field: "game", headerName: "Game", width: 150 },
    {
      field: "votes",
      headerName: "Votes",
      width: 100,
    },
    {
      field: "popularity",
      headerName: "Popularity",
      width: 100,
    },
  ];

  const settingUpGrid = (event) => {
    const currentChoice = event.target.value;
    // First Check the question Selected
    setDataDisplay(currentChoice);

    // Did this as a check to ensure I dont get a lag on the state;
    dataDisplay = currentChoice;

    // Change the data grid based on the selected question 
    if(dataDisplay != null || dataDisplay != ''){
      setRowData(pollStats[dataDisplay]);
    }
  };

  // Creating Row items for each Possible answer result per question
  const setRowData = (source) => {
    if(source== undefined){
      return;
    }
    let rowData = [];
    source.forEach( value => {
      rowData.push({
        id:value['_id'], game: value['_id'], votes: value['votes'], popularity: `${(100 * (value['votes']/pollStats.totalResponses).toFixed(2))}%`
      })
    });
    setGridData(rowData);
  };

  return (
    <div style={{paddingBottom:"30px"}}>
      <h2 style={{textAlign:"center"}}>Live Poll Data Updated Every Minute!</h2>
      <div>
        <Box style={{paddingBottom:"20px"}} sx={{ minWidth: 500 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Question</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dataDisplay}
              label="Question"
              onChange={settingUpGrid}
            >
              {menuItems}
            </Select>
            <FormHelperText>Pick a Question to see the fan favorite right now!</FormHelperText>
          </FormControl>
        </Box>
      </div>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={gridData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[4]}
          checkboxSelection
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
}
