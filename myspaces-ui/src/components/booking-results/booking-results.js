import React from 'react';
import {SingleBooking} from './single-booking-component';
import {EmptyBooking} from './empty-results';
import {Grid} from '@mui/material';
import {PrimaryTitle} from '../page-title/page-title';

/**
 * @name BookingSectionResults
 * @description Generates a section of bookings results to generate bookings within
 * @param {list of bookings, provider permission boolean} 
 * @returns A BookingsSectionResults
 */
const BookingSectionResults = ({bookings, previous = false}) => {

    if (bookings.length === 0){return <EmptyBooking />}

    return (
        <Grid container item xs={12} rowSpacing={5}>
            {bookings.map((booking) => (
                <SingleBooking 
                    bookingID={booking.BookingID}
                    BookedBy={booking.BookedBy}
                    BookedSpace={booking.BookedSpace}
                    StartDate={booking.StartDate}
                    EndDate={booking.EndDate}
                    TotalCost={booking.TotalCost}
                    previous={previous}
                />
            ))}
        </Grid>
    );
}

/**
 * @name BookingsResults
 * @description This component renders all of the current and previous bookngs delivered from the API
 * @param {list of current bookings, list of previous bookings} param0 
 * @returns A BookingsResults Component
 */
export const BookingResults = ({future, previous}) => {

    return (
        <Grid container item xs={10} rowSpacing={5}>
            
            <PrimaryTitle title={"Current Bookings..."} />
            <BookingSectionResults bookings={future} />
            
            <PrimaryTitle title={"Past Bookings..."} /> 
            <BookingSectionResults bookings={previous} previous={true}/>

        </Grid>
    );
}
