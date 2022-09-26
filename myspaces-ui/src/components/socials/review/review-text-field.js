import React from 'react';

import {Grid, TextField} from '@mui/material';

/**
 * @name ReviewTextField
 * @description This component renders the text field inside the comment input of the review prompt
 * @param {comment string for default value, function to set the comment string} 
 * @returns A ReviewTextField
 */
export const ReviewTextField = ({comment, setComment}) => {
    return (
        <Grid item xs={9}>
            <TextField 
                defaultValue={comment}
                label={'Comment'} 
                variant="outlined" 
                onChange={(event) => {setComment(event.target.value)}}
            /> 
        </Grid>
    );
}