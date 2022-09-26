import React, {useEffect, useCallback, useState} from 'react';
import { useNavigate } from "react-router-dom";
import {DesignerColumnSeparator, DesignerRowSeparator} from '../mui-helpers/grid-spacers';
import {Grid, Typography, Button, Dialog, DialogTitle, DialogContent, CircularProgress} from '@mui/material';
import { mySpacesAPIDELETE, mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';
import { ErrorAlert } from '../error-alert/error-alert';
import { DeleteButton, EditButton } from '../utility/utilities';
import { timeDuration } from "../../components/calendar/time-duration"


/* For AT3900-292 UI Refactoring - A Few Todo's lingering here? Do these need to be renamed and refactored?*/

const SingleListingBooking = ({BookedBy, StartDate, EndDate, TotalCost}) => {
    return (
        <Grid 
            container 
            item 
            xs={12} 
            sx={{backgroundColor: '#f7f7f7', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}
        >
            <Grid container item xs={4} > 
                <Grid item xs={12} align={'left'}>
                    <Typography variant="h6" sx={{fontWeight: 'bold', fontStyle: 'italic'}}>
                        Booked By
                    </Typography>
                </Grid>
                
                <Grid item xs={12} align={'left'}>
                    <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                        {BookedBy}
                    </Typography>
                </Grid>
            </Grid>
            <Grid container item xs={4}> 
                <Grid item xs={12} align={'left'}>
                    <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                        {StartDate}
                    </Typography>
                </Grid>
                
                <Grid item xs={12} align={'left'}>
                    <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                        {EndDate}
                    </Typography>
                </Grid>
            </Grid>    
            <DesignerColumnSeparator xs={1} />
            <Grid container item xs={3}> 
                <Grid item xs={12} align={'left'}>
                    <Typography variant="h6" sx={{fontWeight: 'bold', fontStyle: 'italic'}}>
                        Total Cost
                    </Typography>
                </Grid>
                <Grid item xs={12} align={'left'}>
                    <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                        ${TotalCost}
                    </Typography>
                </Grid>
            </Grid> 
        </Grid>
    );
}

//TODO 
const MyListingsBookingsNoResults = () => {
    return (
        <Grid item xs={12} align={'center'}>
            <Typography variant="h6" sx={{fontStyle: 'italic', fontWeight: 'bold'}}>
                You haven't got any bookings for this listing
            </Typography>
        </Grid>
    );
}

//TODO 
const ListingBookingResults = ({bookings}) => {
    return (
        <Grid container item xs={12}>
            {bookings.map((booking) => (
                <SingleListingBooking 
                    BookedBy={booking.BookedBy}
                    StartDate={booking.StartDate}
                    EndDate={booking.EndDate}
                    TotalCost={booking.TotalCost}
                />
            ))}
        </Grid>
    );
}

// TODO
const MyListingsBookingsResults = ({response}) => {

    if (!response.payload || response.payload.length === 0){
        return (<MyListingsBookingsNoResults />);
    } else {
        return (<ListingBookingResults bookings={response.payload}/>);
    }
}

/**
 * @title ListingDeletePrompt
 * @description This component renders the delete prompt if the user selects the delete button
 * @param {displayed, setDisplayed, listingID}
 * @returns A ListingDeletePrompt Component
 */
const ListingDeletePrompt = ({displayed, setDisplayed, listingID}) => {

    const callback = () => {
        setDisplayed(false);
        document.location.reload();
    }

    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Are you sure you want to delete this listing?
            </DialogTitle>
            <DialogContent>
                <Button 
                    variant="container" 
                    sx={{backgroundColor: 'red'}} 
                    onClick={() => {mySpacesAPIDELETE(`/listings/${listingID}`, callback)}}
                >
                    CONFIRM DELETE
                </Button>
                <Button 
                    align={'right'}
                    variant="container" 
                    onClick={() => {
                        setDisplayed(false);   
                    }}>
                    Never Mind!
                </Button>
            </DialogContent>
            
        </Dialog>
    );
}

/**
 * @name ProviderListingEditButton
 * @description This component renders the edit button next to a listing if the user is the owner of the listing
 * @param {the listing ID} 
 * @returns A ProviderListingEditButton Component
 */
const ProviderListingEditButton = ({listingID}) => {
    let navigate = useNavigate();
    return (
        <Grid item xs={12} onClick={() => {navigate(`/Edit%20My%20Listing?listingID=${listingID}`)}}>
            <Button variant="contained">
                EDIT
            </Button>
        </Grid>
    );
}

/**
 * @name ProviderListingDeleteButton
 * @description This component renders the delete button next to a listing if the user is the owner of the listing
 * @param {function to enable/disable the delete prompt} 
 * @returns A ProviderListingDeleteButton Component
 */
const ProviderListingDeleteButton = ({setDeletePrompt}) => {
    return (
        <Grid item xs={12}>
            <Button variant="contained" sx={{backgroundColor: 'red'}} onClick={() => {setDeletePrompt(true)}}>
                DELETE
            </Button>
        </Grid>
    );
}

/**
 * @name SingleCarListing
 * @description This component renders a single listing that is called within a section listing results.
 * @param {listingID, hourlyPrice, streetNo, street, suburb, providerPermission} 
 * @returns A SingleCarListing Component
 */
export const SingleCarListing = ({listingID, hourlyPrice, streetNo, street, suburb}) => {
    
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [showBookings, setShowBookings] = useState(false);

    const [response, setResponse] = useState({
        payload: null
    }); 
    
    const [querying, setQuerying] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!querying){return;}
        mySpacesAPIGET(`/listings/${listingID}/bookings`, setError, setResponse, setQuerying);
    });

    return (
        <Grid container item xs={12}  alignItems="center">
            <DesignerColumnSeparator xs={2} />
            <Grid 
                container 
                item
                xs={6}
                sx={{backgroundColor: '#d9d9d9', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}
            >
                    
                    <Grid container item xs={12} sx={{backgroundColor: '#ccccff', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}>
                    
                        <Grid item xs={12} align={'left'}>
                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                Address:
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} align={'left'}>
                            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                                {streetNo} {street}, {suburb}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} align={'left'}>
                            <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                                Cost:
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} align={'left'}>
                            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                                ${hourlyPrice} /hr
                            </Typography>
                        </Grid>
                    </Grid>   
                
                    <DesignerRowSeparator />
                    {showBookings ? 
                        querying ?
                            <CircularProgress />
                            : 
                            error && error !== "Could not find any results!"? 
                                <Grid container item xs={4} alignItems='center'>
                                    <DesignerColumnSeparator xs={2} />
                                    <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                                        {error}
                                    </ErrorAlert>
                                </Grid> 
                                :
                                <MyListingsBookingsResults response={response}/>
                        :
                        (null)
                    }
                    <Grid 
                        item 
                        xs = {12}
                        onClick={() => {setShowBookings(!showBookings)}}
                    >
                    <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                        {
                            showBookings ? 
                            "Hide bookings ⬆" :
                            "Show bookings ⬇"
                        }
                    </Typography> 
                </Grid>

            </Grid>    
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid container item align={'left'} xs={1} rowSpacing={3}>
                <Grid item xs={12}>
                    <ProviderListingEditButton listingID={listingID}/>
                </Grid>
                
                <Grid item xs={12}>
                    <ProviderListingDeleteButton setDeletePrompt={setDeletePrompt}/>
                </Grid>
                
            </Grid>
            
            <ListingDeletePrompt displayed={deletePrompt} setDisplayed={setDeletePrompt} listingID={listingID}/>
            
        </Grid>
    );
}