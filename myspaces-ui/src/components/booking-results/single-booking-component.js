import React, {useEffect, useState} from 'react';
import {DesignerColumnSeparator} from '../mui-helpers/grid-spacers';
import DeleteIcon from '@mui/icons-material/Delete';
import {Grid, Typography, Button, Dialog, DialogTitle, DialogContent, CircularProgress} from '@mui/material';
import { mySpacesAPIDELETE, mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';
import { SocialsReview, SocialsReviewPrompt } from '../socials/socials-review';

/* For AT3900-292 UI Refactoring - this should probably be it's own component   */
const DeleteBookingPrompt = ({displayed, setDisplayed, bookingID, setCanceled}) => {

    const callback = () => {
        setCanceled(true);                    
        document.location.reload();
    }

    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Are you sure you want to delete this booking?
            </DialogTitle>
            <DialogContent>
                <Button 
                    variant="container" 
                    sx={{backgroundColor: 'red'}} 
                    onClick={() => {
                        setDisplayed(false);
                        mySpacesAPIDELETE(`/bookings/${bookingID}`, callback); 
                    }}>
                    YES
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

/* For AT3900-292 UI Refactoring - also should probably be it's own component  */
const ConfirmBookingDeletedPrompt = ({displayed, setDisplayed}) => {
    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Your booking has been deleted.
            </DialogTitle>
            <DialogContent>
                <Button 
                    align={'center'}
                    variant="container" 
                    
                    sx={{backgroundColor: 'lightgreen'}} 
                    onClick={() => {
                        setDisplayed(false);                       
                        document.location.reload();
                    }}>
                    OK
                </Button>
                
            </DialogContent>
        </Dialog>
    );
}

/**
 * @name ProviderBookingDeleteButton
 * @description This component allows the provider of a booking to delete the booking on the view my bookings page
 * @param {function to set the boolean for the delete prompt} param0 
 * @returns A ProviderBookingDeleteButton
 */
const ProviderBookingDeleteButton = ({setDeletePrompt}) => {
    return (
        <Grid item xs={12}>
            <Button variant="contained" startIcon={<DeleteIcon/>} sx={{backgroundColor: 'red'}} onClick={() => {setDeletePrompt(true)}}>
                DELETE
            </Button>
        </Grid>
    );
}

/**
 * @name SingleBooking
 * @description This component fetches the results of a single booking and renders it to the user when requested
 * @param {bookingID, BookedBy, BookedSpace, StartDate, EndDate, TotalCost, providerPermission}  
 * @returns A SingleBooking Component
 */
export const SingleBooking = ({bookingID, BookedBy, BookedSpace, StartDate, EndDate, TotalCost, previous}) => {

    const [deletePrompt, setDeletePrompt] = useState(false);
    const [canceled, setCanceledPrompt] = useState(false);
    const [review, setReview] = useState(false);
    
    const [response, setResponse] = useState({
        payload: null
    })
    const [bookingQuerying, setBookingQuerying] = useState(true);
    
    const [reviewQuerying, setReviewQuerying] = useState(previous); // if previous true, let's run this method
    const [reviewResponse, setReviewResponse] = useState({
        payload: null
    });
     
    useEffect(() => {
        /* Controls Getting the listings on the given booking */
        if (bookingQuerying){
            mySpacesAPIGET(`/listings/${BookedSpace}`, () => {}, setResponse, setBookingQuerying);
        }
        /* Controls getting the left review from the booking, executes after querying for the listing details */
        if (previous && reviewQuerying){
            mySpacesAPIGET(`/bookings/${bookingID}/reviews`, () => {}, setReviewResponse, setReviewQuerying);
        }
    });

    return (
        <Grid container item xs={12}>
            <DesignerColumnSeparator xs={2} />
            <Grid 
                container 
                item 
                xs={4} 
                sx={{backgroundColor: '#ffda99', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}

            >
            
                    <Grid item xs={12} align={'left'}>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Date
                        </Typography>
                    </Grid>

                    <Grid item xs={12} align={'left'}>
                        <Typography variant="h6">
                        From:    {StartDate} <br/>
                        To: {EndDate}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} align={'left'}>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Address
                        </Typography>
                    </Grid>

                    <Grid item xs={12} align={'left'}>
                        {!response.payload ? <CircularProgress /> : 
                            <Typography variant="h6">
                                {response.payload.StreetNumber} {response.payload.Street} {response.payload.Suburb}
                            </Typography>
                        }

                    </Grid>
                    
                    
                    <Grid item xs={12} align={'left'}>
                        <Typography variant="h6" sx={{fontWeight: 'bold'}}>
                            Total Cost
                        </Typography>
                    </Grid>
                    
                    <Grid item xs={12} align={'left'}>
                        <Typography variant="h6">
                            ${TotalCost}
                        </Typography>
                    </Grid>
                    
            </Grid>    
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid container item align={'left'} xs={2} >
                { !previous ? 
                    <ProviderBookingDeleteButton setDeletePrompt={setDeletePrompt}/>
                    :
                    <SocialsReview reviewResponse={reviewResponse} setPrompt={setReview} />
                }
            </Grid>

            <DeleteBookingPrompt displayed={deletePrompt} setDisplayed={setDeletePrompt} bookingID={bookingID} setCanceled={setCanceledPrompt}/>
            <ConfirmBookingDeletedPrompt displayed={canceled} setDisplayed={setCanceledPrompt} bookingID={bookingID}/>
            <SocialsReviewPrompt bookingID={bookingID} displayed={review} setDisplayed={setReview} />

        </Grid>
    );
}