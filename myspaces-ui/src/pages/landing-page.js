import React, {useState} from "react";
import {Grid, Container, Typography} from "@mui/material"
import { useNavigate } from "react-router-dom";
import {ErrorAlert} from '../components/error-alert/error-alert';
import {SearchBarInput, SearchBarButton} from '../components/search-bar/search-bar';
import { Calendar } from "../components/calendar/calendar"
import { checkTimesValid } from "../components/calendar/time-duration"

/**
 * @name LandingPageTitle
 * @description This component renders the main title on the landing page
 * @returns A LandingPageTitle Component
 */
const LandingPageTitle = () => {
    return (
        <Grid item xs={12}>
            <Typography gutterBottom variant="h2" component="div">
                Welcome to MySpaces
            </Typography>
            <br/>
        </Grid>
    );
}

/**
 * @name LandingPage
 * @description This component renders the very first page the user will encounter when opening the platform.
 - The user can search for a new listing from the search bar
 - The user can click 'enter' or click the search button to process the query
 - The user is notified if they try and search with an empty searchbar
 * @returns A LandingPage Component
 */
export const LandingPage = () => {

    const [searchTerm, setSearchTerm] = useState(String);
    const [startDateTime, setStartDateTime] = useState(null);
    const [finishDateTime, setFinishDateTime] = useState(null);
    const [error, setError] = useState(String);
    
    let navigate = useNavigate();
    
    const handleSearchQuery = () => {
        if (!searchTerm){
            setError('Search Query Required');
            return;
        } else if (!startDateTime || !finishDateTime) {
            setError('Search Times Required');
            return;
        } else if (checkTimesValid(startDateTime, finishDateTime) === false) {
                setError("Make sure that checkin time is before the checkout time!")
                return;
        } else {    
            navigate(`/Space%20Search%20Page?searchterm=${searchTerm}&startDateTime=${startDateTime}&finishDateTime=${finishDateTime}`);
        }
    }

    return (
        <Container sx={{pt:10}}>
            <LandingPageTitle />
            {!error ? (null) : 
                <ErrorAlert severity="error" onClick={() => setError(null)}>
                    {error}
                </ErrorAlert>
            }
            <Grid sx={{pt:10}} justifyContent="center" container>
                <SearchBarInput xs={4} defineSearchTerm={setSearchTerm} onSearch={handleSearchQuery}/>
                
                <Calendar name="Check In" value={null} datetime={setStartDateTime} />
                <Calendar name="Check Out" value={null} datetime={setFinishDateTime}/>
                <SearchBarButton onSearch={handleSearchQuery}/>
            </Grid>
        </Container>
    );
}