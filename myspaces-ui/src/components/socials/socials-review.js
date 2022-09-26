import React, {useState} from 'react';

import {
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Button, 
    Grid, 
    Typography
} from '@mui/material';

import { ReviewTextField } from './review/review-text-field';
import { ReviewLikedField } from './review/review-liked-field';
import { ReviewButtons } from './review/review-buttons';
import { mySpacesAPIPOST } from '../../my-spaces-api/call-my-spaces-api';
import { ErrorAlert } from '../error-alert/error-alert';
import { DesignerRowSeparator } from '../mui-helpers/grid-spacers';

/**
 * @name SocialsReviewPrompt
 * @description This prompt is rendered when the user want's to leave a review on a previous booking they have made
 * @param {boolean indicating whether it's displayed, function to change the displayed boolean}
 * @returns A SocialsReviewPrompt
 */
export const SocialsReviewPrompt = ({bookingID, displayed, setDisplayed}) => {

    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(false);
    
    const [error, setError] = useState(null)

    const handleReview = () => { 
        /* Criteria for a real review */
        if (comment === '' && !liked){return;}
        
        const callback = () => {
            setDisplayed(false);                       
            document.location.reload();
        }
        
        mySpacesAPIPOST('/reviews/', JSON.stringify({
            BookingID: bookingID,
            Liked: liked,
            Comment: comment
        }), setError, callback);
    }

    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Leave a Review!
            </DialogTitle>
            <DialogContent>
            
                {!error ? (null) : 
                    <ErrorAlert severity="error" onClick={() => setError(null)}>
                        {error}
                    </ErrorAlert>
                } 
                
                <Grid container rowSpacing={1} >
                    <DesignerRowSeparator />
                    <ReviewTextField comment={comment} setComment={setComment} />
                    <ReviewLikedField liked={liked} setLiked={setLiked} />
                    <ReviewButtons setDisplayed={setDisplayed} handleReview={handleReview} />
                </Grid>
            </DialogContent>
        </Dialog>
    );
}

/**
 * @name SocialsReviewButton
 * @description This component renders next to a previous booking on the View My Bookings Page, allowing the user to leave a review.
 * - If the reviewResponse.payload is null, this means that we have not left a review yet, so we provide a button to do so
 * - If there is content in reviewResponse.payload, this is already a review, we handle accordingly!
 * @param {function to change the review prompt boolean} 
 * @returns A SocialsReviewButton Boolean
 */
export const SocialsReview = ({reviewResponse, setPrompt}) => {
    if (!reviewResponse.payload){
        return (
            <Grid item xs={12}>
                <Button variant="contained" onClick={() => {setPrompt(true)}}>
                    LEAVE A REVIEW
                </Button> 
            </Grid>
        );
    } else {
        return (
            <Grid item xs={12} align={'center'} >
                <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                   {'Thanks for leaving a review!'}                           
                </Typography>
            </Grid>
        );
    }
}