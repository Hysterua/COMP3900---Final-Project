import React from 'react';
import {SingleCarListing} from './single-listing-component';
import {EmptyListing} from './empty-results';
import {Grid} from '@mui/material';
import { Socials } from '../socials/socials';
import { DesignerMatrixSeparator} from '../mui-helpers/grid-spacers';

/**
 * @name ListingsSectionResults
 * @description This component renders a single section of the listing results.
 * @param {list of listings, provider permission boolean}
 * @returns A ListingsSectionResults Component
 */
export const ListingsSectionResults = ({listings, providerPermission}) => {

    if (listings.length === 0){return <EmptyListing />}

    return (
        <Grid container item xs={12} rowSpacing={1}>
            {listings.map((listing) => (
                <React.Fragment>
                    <Socials 
                        listingID={listing.ListingID}
                        address={`${listing.StreetNumber} ${listing.Street}, ${listing.Suburb}`}
                    />
                    <SingleCarListing 
                        listingID={listing.ListingID}
                        hourlyPrice={listing.HourlyPrice}
                        streetNo={listing.StreetNumber}
                        street={listing.Street}
                        suburb={listing.Suburb}
                        providerPermission={providerPermission}
                    />
                    <DesignerMatrixSeparator n={2}/>
                </React.Fragment>
            ))}
        </Grid>
    );
}