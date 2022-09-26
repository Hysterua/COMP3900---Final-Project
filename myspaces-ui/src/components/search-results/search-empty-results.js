import React from 'react';
import {Grid, Typography} from '@mui/material';

/**
 * @name EmptyListing
 * @description When a list of listings component could not get any results.  This is displayed
 * @returns An EmptyListing Component
 */
export const EmptyListing = () => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                {"We couldn't find anything for you :( "}
            </Typography>
        </Grid>
    );
}