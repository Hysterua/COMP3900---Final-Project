import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import {DesignerRowSeparator, DesignerColumnSeparator} from '../../components/mui-helpers/grid-spacers';

import { useNavigate } from "react-router-dom";
import {SearchBarInput, SearchBarButton, SearchBarFilter} from '../../components/search-bar/search-bar';
import {SearchResults} from '../../components/search-results/search-results';
import {LoadingResults} from "../../components/loading-animation/loading-animation";
import { ErrorAlert } from '../../components/error-alert/error-alert';
import { mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';
import { Calendar } from "../../components/calendar/calendar"
import { checkTimesValid } from "../../components/calendar/time-duration"


/**
 * @name NoSearchResults
 * @description If the API returns an error code, this component is rendered to the user
 * @returns A NoSearchResults Component
 */
const NoSearchResults = () => {
    return (
        <Grid item xs={6}>
            <Typography variant="h6">
                {"We couldn't find anything for you :( "}
            </Typography>
        </Grid>
    );
}

/**
 * @name SearchContent
 * @description This component is rendered after the API returns some form of results
 * @param {response object}  
 * @returns A SearchContentComponent
 */

const SearchContent = ({payload, searchContext}) => {

    if (!payload){return <NoSearchResults />}
    
    return <SearchResults recommended={payload.Recommended} remaining={payload.Remaining} searchContext={searchContext}/>

}

/**<Calendar name="Check In" datetime={filterContext.setStartDateTimeFilter}/>
                    <Calendar name="Check Out" datetime={filterContext.setFinishDateTimeFilter}/>
 * @name SpaceSearchPage
 * @description Designs the UI and Functionality of the space search page
 - A User can input a search query into the search bar
 - A user receives results based on their search query
 - A user can search again and receive new results
 - A user sees a loading screen while they are waiting inbetween searches.
 - A user can click on a found listing and are taken to the booking page
 - A user is recommended listings and also given any other listings
 - A user can click on a searched listing and be redirected to the booking page
 * @returns A SpaceSearchPage Component
 */
export const SpaceSearchPage = () => {

    let navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState(String);

    const startPassedIn = (new URL(document.location)).searchParams.get('startDateTime');
    const finishPassedIn = (new URL(document.location)).searchParams.get('finishDateTime');
    
    const [startDateTimeFilter, setStartDateTimeFilter] = useState(startPassedIn);
    const [finishDateTimeFilter, setFinishDateTimeFilter] = useState(finishPassedIn);
    const [costFilter, setCostFilter] = useState(null);
    const [lengthFilter, setLengthFilter] = useState(null);
    const [widthFilter, setWidthFilter] = useState(null);
    const [heightFilter, setHeightFilter] = useState(null);
    
    const filterContext = {
        startDateTimeFilter: startDateTimeFilter,
        finishDateTimeFilter: finishDateTimeFilter,
        costFilter: costFilter,
        lengthFilter: lengthFilter,
        widthFilter: widthFilter,
        heightFilter: heightFilter,
        setStartDateTimeFilter: setStartDateTimeFilter,
        setFinishDateTimeFilter: setFinishDateTimeFilter,
        setCostFilter: setCostFilter,
        setLengthFilter: setLengthFilter,
        setWidthFilter: setWidthFilter,
        setHeightFilter: setHeightFilter,
    };
    
    const searchContext = {
        searchTerm: searchTerm,
        startDateTimeFilter: startDateTimeFilter,
        finishDateTimeFilter: finishDateTimeFilter,
        costFilter: costFilter,
        lengthFilter: lengthFilter,
        widthFilter: widthFilter,
        heightFilter: heightFilter
    }
    
    const [querying, setQuerying] = useState(false);
    const [response, setResponse] = useState({
        payload: null
    });

    
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!searchTerm){
            const querySearch = (new URL(document.location)).searchParams.get('searchterm');
            if (!querySearch || querySearch === ''){setSearchTerm(null); setQuerying(false);}
            else {
                setSearchTerm(querySearch);
                setQuerying(true);
            }
            return;
        }


    })
    
    useEffect(() => {
        if (querying){
            mySpacesAPIGET(`/search/?searchTerm=${searchTerm}&bookingStart=${startDateTimeFilter}&bookingFinish=${finishDateTimeFilter}&cost=${costFilter??"0"}&length=${lengthFilter??"0.0"}&width=${widthFilter??"0.0"}&height=${heightFilter??"0.0"}`, 
                            setError, setResponse, setQuerying);
        } 
        
    }, [querying]);
    
    const handleSearch = () => {

        if (!searchTerm || !startDateTimeFilter || !finishDateTimeFilter){
            setError("Make sure to fill all fields before searching")
            return;
        }

        else if (checkTimesValid(startDateTimeFilter, finishDateTimeFilter) === false) {
            setError("Make sure that check-in time is before the check-out time and try again!")
            return;
        }

        navigate(`/Space%20Search%20Page?searchterm=${searchTerm}&startDateTime=${startDateTimeFilter}&finishDateTime=${finishDateTimeFilter}`);   
        setSearchTerm(searchTerm);
        setQuerying(true);
    }
        
    return (
        <div className="space-search-page">
        
            <Grid container alignItems="center" justifyContent="center" rowSpacing={5} columnSpacing={{xs: 1}}>
                
                <DesignerRowSeparator />
                <DesignerColumnSeparator xs={1} />

                    <SearchBarInput xs={6} defineSearchTerm={setSearchTerm} onSearch={handleSearch}/>

                    <Calendar name="Check In" value={new Date(startPassedIn.slice(0, startPassedIn.length - 44))} datetime={filterContext.setStartDateTimeFilter}/>
                    <Calendar name="Check Out" value={new Date(finishPassedIn.slice(0, finishPassedIn.length - 44))} datetime={filterContext.setFinishDateTimeFilter}/>

                    <SearchBarFilter context={filterContext} handleSearch={handleSearch}/>
                    <SearchBarButton onSearch={handleSearch} />
                
                {error ? <DesignerRowSeparator /> : null}
                
                {!error || error === "We couldn't find this suburb!" ? (null) : 
                    <Grid container item xs={4} alignItems='center'>
                        <DesignerColumnSeparator xs={2} />
                        <Grid item xs={8}>
                            <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                                {error}
                            </ErrorAlert>
                        </Grid>
                    </Grid>
                }
                
                <DesignerRowSeparator />

                {querying ? <LoadingResults /> : <SearchContent payload={response.payload} searchContext={searchContext}/> }
         
            </Grid>
        </div>
    );
}