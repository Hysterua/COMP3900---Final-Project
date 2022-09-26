import * as React from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers-pro/';
import { Grid } from '@mui/material';

/**
 * @name Calendar
 * @description Designs a Calendar component that is used to illustrate availability for the car spaces and
 * sets the search term for the checkin and checkout times
 * @param {props} - This can be props.value which is the passed in default value of the calendar/clock
 * or it can be props.datetime which is the hook that is used to pass the new datetime back
 * 
 * @returns A LocalizationProvider Component
 */

export function Calendar(props) {

  const [value, setValue] = React.useState(props.value);
  
  return (
    <Grid item alignItems="stretch" style={{ display: "flex" }} sx={{ px: 1 }}>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateTimePicker
          renderInput={(props) => <TextField {...props} />}
          label={props.name}
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            props.datetime(newValue);
          }}

          minDateTime={new Date()}
        />
      </LocalizationProvider>
    </Grid>
  );
}