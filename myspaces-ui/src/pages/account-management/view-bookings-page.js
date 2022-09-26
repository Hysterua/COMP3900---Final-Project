import React, {useEffect, useState} from 'react';

import {Grid, Typography} from '@mui/material';
import { DesignerRowSeparator } from '../../components/mui-helpers/grid-spacers';
import { fetchAuthorisedUserID } from '../../authentication/user-cookie-management';
import { BookingResults } from '../../components/booking-results/booking-results';
import { ErrorAlert } from '../../components/error-alert/error-alert';
import { LoadingResults } from '../../components/loading-animation/loading-animation';
import {mySpacesAPIGET} from "../../my-spaces-api/call-my-spaces-api"

/**
 * @name MyBookingsNoResults
 * @description If there are no results from the API, this component is rendered to the user.
 * @returns A MyBookingsNoResults Component
 */
const MyBookingsNoResults = () => {
    return (
        <Grid item xs={8}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                You dont have any bookings!
            </Typography>
        </Grid>
    );
}

/**
 * @name MyBookingsResults
 * @description When the API has finished functioning, this component is rendered to the user.
 * @param {response object} 
 * @returns A MyBookingsResults Component
 */
const MyBookingsResults = ({response}) => {

    if (!response.payload){return <MyBookingsNoResults />}
    
    const future = response.payload.Future;
    const previous = response.payload.Previous;
    
    if (future.length === 0 && previous.length === 0){
        return <MyBookingsNoResults />
    }
    
    return <BookingResults future={future} previous={previous}/>

}

/**
 * @name ViewMyBookingsPage
 * @description Designs all the UI and Functionality for the View My Bookings Page
 - A user can see all of their bookings
 - A user is able to delete a booking
 * @returns A ViewMyBookingsComponent
 */
export const ViewMyBookingsPage = () => {

    const userID = fetchAuthorisedUserID();
    const [querying, setQuerying] = useState(true);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState({
        payload: null
    })


    useEffect(() => {
        if (!querying) {return}
        mySpacesAPIGET(`/user/${userID}/bookings`, setError, setResponse, setQuerying);
    });

    return (
    <div className="view-my-bookings-page">
        <Grid container rowSpacing={5} columnSpacing={{xs: 1}} >
            <DesignerRowSeparator />   
            
            {!error || error === "Could not find any results!" ? (null):
                <Grid container item xs={4} alignItems='center'>
                    <DesignerRowSeparator />
                    <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                       {error}
                    </ErrorAlert>
                </Grid>
            }
            
            {querying ?
                 <LoadingResults /> : <MyBookingsResults response={response}/> 
            }
            
        </Grid>
    </div>
    );
}