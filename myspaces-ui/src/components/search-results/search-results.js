import React, {useState, useEffect} from 'react';
import {SingleListingSearch} from './single-listing-search';
import {EmptyListing} from './search-empty-results';
import {Grid, CircularProgress, Typography} from '@mui/material';
import {PrimaryTitle} from '../page-title/page-title';
import { Socials } from '../socials/socials';
import { DesignerColumnSeparator, DesignerMatrixSeparator, DesignerRowSeparator} from '../mui-helpers/grid-spacers';
import { mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';

/**
 * @name SearchSectionResults
 * @description This component renders a single section of the listing results.
 * @param {list of listings, provider permission boolean}
 * @returns A SearchSectionResults Component
 */
export const SearchSectionResults = ({listings, requirePT, searchContext}) => {

    if (!listings || listings.length === 0){return <EmptyListing />}

    return (
        <Grid container item xs={12} rowSpacing={1}>
            {listings.map((listing) => (
                <React.Fragment>
                    <Socials 
                        listingID={listing.ListingID}
                        address={`${listing.StreetNumber} ${listing.Street}, ${listing.Suburb}`}
                    />
                    <SingleListingSearch
                        listingID={listing.ListingID}
                        hourlyPrice={listing.HourlyPrice}
                        streetNo={listing.StreetNumber}
                        street={listing.Street}
                        suburb={listing.Suburb}
                        distance={listing.Distance}
                        requirePT={requirePT}
                        dataPT={!requirePT ? null : {
                            duration: listing.Duration,
                            transit: listing.TransitMethod
                        }}
                        searchContext={searchContext}
                    />
                    <DesignerMatrixSeparator n={2}/>
                </React.Fragment>
            ))}
        </Grid>
    );
}

/**
 * @name SearchResults
 * @description This component renders the two sets of data from the search page, the recommended section and the remaining data
 * @param {recommended, remaining}  
 * @returns A SearchResults Component
 */
export const SearchResults = ({recommended, remaining, searchContext}) => {

    const [querying, setQuerying] = useState(true);
    const [response, setResponse] = useState({
        payload: null
    });
    
    useEffect(() => {
        if (!querying){return;}
        mySpacesAPIGET(`/search/pt/?searchTerm=${searchContext.searchTerm}&bookingStart=${searchContext.startDateTimeFilter}&bookingFinish=${searchContext.finishDateTimeFilter}&cost=${searchContext.costFilter??"0"}&length=${searchContext.lengthFilter??"0.0"}&width=${searchContext.widthFilter??"0.0"}&height=${searchContext.heightFilter??"0.0"}`, () => {}, setResponse, setQuerying);
    }, [querying])
    
    return (
        <Grid container item xs={10} rowSpacing={5}>
        
            <DesignerColumnSeparator xs={2} />
        
            <Grid item xs={6}>
                <Typography variant="h6" align={'left'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                   {`Showing results for your search "${searchContext.searchTerm}"`}                           
                </Typography>
            </Grid>

            <DesignerRowSeparator />
            
            <PrimaryTitle title={`Recommended for you...`} />
            <SearchSectionResults listings={recommended} requirePT={false} searchContext={searchContext}/>
            
            <PrimaryTitle title={"Nearby with Public Transport..."} />
            {querying ? 
                <React.Fragment>
                    <DesignerRowSeparator />
                    <DesignerColumnSeparator xs={2} />
                    <CircularProgress />
                </React.Fragment>
            : 
                <SearchSectionResults listings={response.payload} requirePT={true} searchContext={searchContext}/>
            }
            
            <DesignerRowSeparator />
            
            <PrimaryTitle title={"Also in your area..."} /> 
            <SearchSectionResults listings={remaining} requirePT={false} searchContext={searchContext}/>

        </Grid>
    );
}