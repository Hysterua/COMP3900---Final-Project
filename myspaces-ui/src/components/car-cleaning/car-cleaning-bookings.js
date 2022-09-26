import React from 'react';
import { Box, MenuItem, FormControl, InputLabel, Select, Grid } from '@mui/material';

/**
 * @name CarCleaningDropdown
 * @description This component renders the list of booking times as a drop down component on the UI
 * @param {list of available times, function to set the chosen booking} param0 
 * @returns A CarCleaningDropdown Component
 */
const CarCleaningDropdown = ({times, setBookingChosen}) => {

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
        setBookingChosen(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth> 
            <InputLabel id="demo-simple-select-label">Booking Times</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Booking Time"
            onChange={handleChange}
            >
            {times.map((time) => (
                <MenuItem value={time}>{time}</MenuItem>
            ))}
            </Select>
        </FormControl>
        </Box>
    );
}

/**
 * @name CarCleaningBookingTimes
 * @description This component renders all of the available booking times for the add-on service given the 
 * API call data from our webscraping mechanism.
 * @param {list of bookings from API, function to set the chosen booking, start time, end time} param0 
 * @returns A CarCleaningBookingTimes Comnponent
 */
export const CarCleaningBookingTimes = ({bookings, setBookingChosen, startDateTime, finishDateTime}) => {

    const formattedStartDateTime = new Date(startDateTime)
    const formattedFinishDateTime = new Date(finishDateTime)

    var availableTimesArray = []

    const bookingArray = bookings[0].BookingTimes

    for (let i = 0; i < bookingArray.length; i++) {
        var temp = Number(bookingArray[i].slice(0,2))

        if (bookingArray[i].includes("PM") && temp !== 12) {temp += 12}

        if (formattedFinishDateTime.getDate() === formattedStartDateTime.getDate()) {
            if (temp > formattedStartDateTime.getHours() && temp < formattedFinishDateTime.getHours()) {
                availableTimesArray.push(bookingArray[i])
            }
        } 

        else if (temp > formattedStartDateTime.getHours()) {
            availableTimesArray.push(bookingArray[i])
        }

        if (temp == 16) {break}
    }

    return (
        <Grid item xs={12}>
            <CarCleaningDropdown times={availableTimesArray} setBookingChosen={setBookingChosen}/>
        </Grid>
    )

}

