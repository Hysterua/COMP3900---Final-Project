import React from 'react';
import { useNavigate } from "react-router-dom";
import {DesignerColumnSeparator, DesignerRowSeparator} from '../mui-helpers/grid-spacers';
import {Grid, Typography} from '@mui/material';
import { timeDuration } from '../calendar/time-duration';

import { icons_urls } from '../map/visual_options';

/**
 * @name SearchListingPrimaryDetails
 * @description This component renders imporant data of a searchable listing including public transport of required
 * @param {boolean indicating whether we want to render public transport, any public transport data} 
 * @returns A SearchListingPrimaryDetails Component
 */
const SearchListingPrimaryDetails = ({requirePT, dataPT, distance}) => {

    const transitMethod = !requirePT ? [] : dataPT.transit.split('|');
    
    const displayDistance = parseFloat(distance).toFixed(2);

    return (
        <Grid container item xs={5} sx={{backgroundColor: '#ffffff', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}>
                    {requirePT ? 
                        <React.Fragment>
                            <Grid container item xs={12} align={'left'} columnSpacing={4.75} rowSpacing={1}>
                                <DesignerRowSeparator />
                                    { transitMethod.map(
                                        (method) => {
                                            switch(method){
                                                case "WALKING": return <Grid item xs={1}><img src={icons_urls.WALKING} /></Grid>;
                                                case "BUS": return <Grid item xs={1}><img src={icons_urls.BUS} /></Grid>;
                                                case "HEAVY_RAIL": return <Grid item xs={1}><img src={icons_urls.HEAVY_RAIL} /></Grid>;
                                                case "TRAM": return <Grid item xs={1}><img src={icons_urls.TRAM} /></Grid>;
                                                case "FERRY": return <Grid item xs={1}><img src={icons_urls.FERRY} /></Grid>;
                                                default: return null;
                                            }
                                        }
                                    )}
                            </Grid>
                        
                            <Grid item xs={12} >
                                <Typography variant="h5" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                                    {'Public Transport'}                           
                                </Typography>
                            </Grid>
                            
                            <Grid container item xs={12}>
                                <Grid item xs={6}>
                                    <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                                        {`${dataPT.duration} mins`}                           
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={6}>
                                    <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                                        {`${displayDistance} km`}                           
                                    </Typography>
                                </Grid>
                            </Grid>
                            
                            
                        </React.Fragment>
                        : 
                        <React.Fragment>
                            <Grid item xs={1}><img src={icons_urls.CAR} /></Grid>
                            <Grid item xs={12} >
                                <Typography variant="h5" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                                    {'Available Now!'}                           
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                    <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                                        {`${displayDistance} km`}                           
                                    </Typography>
                                </Grid>
                        </React.Fragment>

                    }
        </Grid>
    );
}

/**
 * @name SearchListingSecondaryDetails
 * @description On a Searchable Listing, this component renders all of the address and cost data of a listing
 * @param {street number, street, suburb, hourly price} 
 * @returns A SearchListingSecondaryDetails
 */
const SearchListingSecondaryDetails = ({streetNo, street, suburb, hourlyPrice, searchContext}) => {
    return (
        <Grid container item xs={6} sx={{backgroundColor: '#ccccff', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}>           
            <Grid item xs={12} align={'left'}>
                <Typography variant="h6" sx={{fontWeight: 'bold', fontStyle: 'italic'}}>
                    Address
                </Typography>
            </Grid>
            
            <Grid item xs={12} align={'left'}>
                <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                    {streetNo} {street}, {suburb}
                </Typography>
            </Grid>
            
            <Grid item xs={12} align={'left'}>
                <Typography variant="h6" sx={{fontWeight: 'bold', fontStyle: 'italic'}}>
                    Cost
                </Typography>
            </Grid>
            
            <Grid item xs={12} align={'left'}>
                <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                    ${hourlyPrice} /hr - ${hourlyPrice * timeDuration(searchContext.startDateTimeFilter, searchContext.finishDateTimeFilter)} Total
                </Typography>
            </Grid>
        </Grid>  
    );
}

/**
 * @name SingleCarListing
 * @description This component renders a single listing that is called within a section listing results.
 * @param {listingID, hourlyPrice, streetNo, street, suburb, providerPermission} 
 * @returns A SingleCarListing Component
 */
export const SingleListingSearch = ({listingID, hourlyPrice, streetNo, street, suburb, distance, requirePT, dataPT, searchContext}) => {

    let navigate = useNavigate();

    return (
        <Grid container item xs={12}>
            <DesignerColumnSeparator xs={2} />
            <Grid 
                container 
                item 
                xs={6} 
                sx={{backgroundColor: '#d9d9d9', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}
                onClick={() => {navigate(`/Space%20Booking%20Page?listingID=${listingID}&suburbPT=${requirePT ? searchContext.searchTerm : null}&startBooking=${searchContext.startDateTimeFilter}&finishBooking=${searchContext.finishDateTimeFilter}`);}}
            >
                <Grid container item xs={12} >
                
                    <SearchListingPrimaryDetails requirePT={requirePT} dataPT={dataPT} distance={distance}/>

                    <DesignerColumnSeparator xs={1} />
                    
                    <SearchListingSecondaryDetails 
                        streetNo={streetNo}
                        street={street}
                        suburb={suburb}
                        hourlyPrice={hourlyPrice}
                        searchContext={searchContext}
                    />
                    
                </Grid>
            
            </Grid>    
        
        </Grid>
    );
}