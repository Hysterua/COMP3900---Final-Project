import React, {useEffect, useState} from 'react';
import {Grid, Typography} from '@mui/material';
import {ListingsSectionResults} from '../../components/listing-results/listing-results';
import {DesignerRowSeparator, DesignerColumnSeparator} from '../../components/mui-helpers/grid-spacers';
import {LoadingResults} from '../../components/loading-animation/loading-animation';
import { PrimaryTitle } from '../../components/page-title/page-title';
import { ErrorAlert } from '../../components/error-alert/error-alert';
import { fetchAuthorisedUserID } from '../../authentication/user-cookie-management';
import { mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';

/**
 * @name MyListingsNoResults
 * @description If there are no results returned from the API, this component is rendered to the page
 * @returns A MyListingsNoResults Component
 */
const MyListingsNoResults = () => {
    return (
        <Grid item xs={8}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                You haven't registered any spaces on our platform
            </Typography>
        </Grid>
    );
}

/**
 * @name MyListingsResults
 * @description Prepares the required list of results for the View My Listings Page Component
 * @param {response object} 
 * @returns A MyListingsResults Component
 */
const MyListingsResults = ({response}) => {

    if (!response.payload || response.payload.length === 0){
        return (<MyListingsNoResults />);
    } else {
        return (
            <Grid container item xs={10} rowSpacing={5}>
                <ListingsSectionResults listings={response.payload} providerPermission={true}/>
            </Grid>
        );
    }
}

/**
 * @name ViewMyListingsPage
 * @description Designs the UI and controls the functionality for the View My Listings Page
 - A user can see all of the listings they have made on the page
 - A user can choose to delete a listing from this page
 - A user can choose to edit a listing from this page
 * @returns A ViewMyListingsPage Component
 */
export const ViewMyListingsPage = () => {

    const [querying, setQuerying] = useState(true);
    const [response, setResponse] = useState({
        payload: null
    }); 
    
    const [error, setError] = useState(null);
 
    useEffect(() => {
        if (!querying){return;}
        mySpacesAPIGET(`/user/${fetchAuthorisedUserID()}/listings`, setError, setResponse, setQuerying);
    });
                
    return (
        <div className="view-my-listings-page">
            <Grid container rowSpacing={5} columnSpacing={{xs: 1}}>
            
                <DesignerRowSeparator />
                
                <Grid container item xs={10} rowSpacing={5}>
                    <PrimaryTitle title={"My Listings"} />
                </Grid>
                
                {!error || error === "Could not find any results!" ? (null) : 
                    <Grid container item xs={4} alignItems='center'>
                        <DesignerColumnSeparator xs={2} />
                        <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                            {error}
                        </ErrorAlert>
                    </Grid>
                }
                
                <DesignerRowSeparator />
            
                {querying ? 
                    <LoadingResults /> : <MyListingsResults response={response}/>    
                }
            </Grid>
        </div>
    );
}
