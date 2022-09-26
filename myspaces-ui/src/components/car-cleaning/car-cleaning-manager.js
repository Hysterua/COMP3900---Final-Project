import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { LoadingResults } from '../../components/loading-animation/loading-animation';
import { mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';
import { CarCleaningAddonList } from '../../components/car-cleaning/car-cleaning-addons'
import { CarCleaningBookingTimes } from '../../components/car-cleaning/car-cleaning-bookings'

/**
 * @name CarCleaningManager
 * @description This component renders the entire add-on servce interface UX for the user
 * @param {function to set the cost of addon, function to set the chosen booking, start time of booking, end time of booking} param0 
 * @returns A CarCleaningManager Component
 */
export const CarCleaningManager = ({
    setCostOfAddon, 
    setBookingChosen, 
    startDateTime, 
    finishDateTime, 
    queryingAddons, 
    setQueryingAddons,
    queryingBookingTimes,
    setQueryingBookingTimes
    }) => {

    // const [queryingAddons, setQueryingAddons] = useState(true);
    const [addons, setAddons] = useState({payload: null});
    // const [queryingBookingTimes, setQueryingBookingTimes] = useState(true);
    const [bookings, setBookings] = useState({payload: null});
    const [onChange, setOnChange] = useState(false);

    useEffect(() => {
        if (queryingAddons === true && onChange === false) {
            setOnChange(true)
            mySpacesAPIGET(`/SchmickoData/`, () => {}, setAddons, setQueryingAddons)
        }
    }, [queryingAddons]);

    useEffect(() => {
        if (queryingAddons === false && onChange === true) {
            mySpacesAPIGET(`/findSchmikoAvailability/?date=${"04/08"}`, () => {}, setBookings, setQueryingBookingTimes)
        }
    }, [queryingAddons, onChange]);


    return (
        <Grid item xs={10} align="center">
        
            <Typography component={"span"} gutterBottom variant="h6">
                <br/><b>Optional Booking Addons:</b>
            </Typography>

            <Typography component={"span"} gutterBottom variant="body2">   
                <br/>These are only available for the first day of the booking.<br/><br/><br/>
            </Typography>

            {queryingAddons ? <LoadingResults /> : <CarCleaningAddonList addons={addons.payload} setCostOfAddon={setCostOfAddon}/> }
            <br/>

            <Typography component={"span"} gutterBottom variant="h6">   
                <br/><b>Optional Booking Addon Times:</b>
            </Typography>

            <Typography component={"span"} gutterBottom variant="body2">   
                <br/>This may take a minute as we are contacting the partner website.<br/><br/>
            </Typography>

            {queryingBookingTimes ? <LoadingResults /> : <CarCleaningBookingTimes bookings={bookings.payload} setBookingChosen={setBookingChosen} startDateTime={startDateTime} finishDateTime={finishDateTime}/> }
            <br/><br/>
        </Grid>
    );
}