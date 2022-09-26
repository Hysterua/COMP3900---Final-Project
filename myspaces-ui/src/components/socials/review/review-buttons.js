import React from 'react';

import {Grid, Button} from '@mui/material';

/**
 * @name ReviewButtons
 * @description This component renders the buttons on the review prompt
 * @param {function to change the display boolean, handle function to handle the button press for leaving a review}  
 * @returns A ReviewButtons Component
 */
export const ReviewButtons = ({setDisplayed, handleReview}) => {
    return (
        <React.Fragment>
             <Grid item xs={6}>
                <Button 
                    align={'center'}
                    variant="container" 
                    sx={{backgroundColor: '#2196f3', color: '#ffffff'}}
                    onClick={() => {
                        handleReview();
                    }}>
                    OKAY
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Button 
                    align={'center'}
                    variant="container" 
                    onClick={() => {
                        setDisplayed(false);                       
                    }}>
                    BACK
                </Button>
            </Grid>
        </React.Fragment>
    );
}