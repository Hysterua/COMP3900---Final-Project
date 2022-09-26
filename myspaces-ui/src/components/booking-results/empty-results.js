import React from 'react';
import {Grid, Typography} from '@mui/material';

/**
 * @name EmptyBooking
 * @description When there are no bookings to be displayed on the view my bookings page, this component is rendered
 * @returns An EmptyBookingComponent
 */
export const EmptyBooking = () => {
    return (
        <Grid item xs={12}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                {"We couldn't find anything for you :( "}
            </Typography>
        </Grid>
    );
}