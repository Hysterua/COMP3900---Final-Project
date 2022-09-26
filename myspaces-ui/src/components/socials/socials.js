import React, {useState, useEffect} from 'react';

import {CircularProgress, Grid, Typography} from '@mui/material';
import { DesignerColumnSeparator} from '../mui-helpers/grid-spacers';
import { SocialsLikes } from './socials-likes';
import { SocialsCommentsIcon, SocialsComments} from './socials-comments';
import { mySpacesAPIGET } from '../../my-spaces-api/call-my-spaces-api';

/**
 * @name SocialsLoading
 * @description This component will render while the API is loading data from the server
 * @returns A SocialsLoading Component
 */
const SocialsLoading = () => {
    return (
        <Grid item xs={12} align={'center'} >
            <CircularProgress />
        </Grid>
    );
}

/**
 * @name SocialsEmpty
 * @description If the listing has zero content to render to the page, this component will render to the user
 * @returns A SocialsEmpty Component
 */
const SocialsEmpty = () => {
    return (
        <Grid item xs={12} align={'center'} >
             <Typography variant="h6" align={'center'} sx={{color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic'}}>
                {'No Reviews on this Space!'}                      
            </Typography>
        </Grid>
    ); 
}

/**
 * @name SocialsError
 * @description If the response payload from the API is null, we will render this component
 * @returns A SocialsError Component
 */
const SocialsError = () => {
    return (
        <Grid item xs={12} align={'center'} >
             <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                {'Something went wrong!'}                           
            </Typography>
        </Grid>
    );
}

/**
 * @name SocialsContent
 * @description Given that the results has some type of content to render, this component will render it to the page
 * @param {address string, number of likes, list of comments} param0 
 * @returns A SocialsContent Component
 */
const SocialsContent = ({address, likes, comments}) => {

    const [showComments, setShowComments] = useState(false);

    return <React.Fragment>
        <SocialsLikes likes={likes}/>
        <SocialsCommentsIcon onClick={() => {setShowComments(true)}}/>
        <SocialsComments title={address} comments={comments} displayed={showComments} setDisplayed={setShowComments}/>
    </React.Fragment>
}

/**
 * @name SocialsResults
 * @description The SocialsResults component breaks down the response object and renders accordingly the edge cases we want to address
 * @param {response object from API, an address string we want to display in the comments section} param0 
 * @returns A SocialsResults Component
 */
const SocialsResults = ({response, address}) => {
    if (!response.payload){return <SocialsError />}
    else if (response.payload.TotalLikes === 0 && response.payload.Comments.length === 0){return <SocialsEmpty />}
    return <SocialsContent address={address} likes={response.payload.TotalLikes} comments={response.payload.Comments}/>
}

/**
 * @name Socials
 * @description The socials component renders the likes and comments functionalities of listings
 * @param {listingID, address}
 * @returns A Socials Component
 */
export const Socials = ({listingID, address}) => {

    const [querying, setQuerying] = useState(true);
    const [response, setResponse] = useState({
        payload: null
    });
    
    useEffect(() => {
        if (!querying){return;}
        mySpacesAPIGET(`/listings/${listingID}/reviews`, () => {}, setResponse, setQuerying);
    }, [querying]);

    return (
        <Grid container item xs={12} >
        
            <DesignerColumnSeparator xs={2} />
            
            <Grid container item xs={6} sx={{backgroundColor: '#ffffff', border: 2, borderRadius: 3, borderColor: '#b8b8b8'}}>
                
                {querying ? <SocialsLoading /> : <SocialsResults response={response} address={address}/>}
                
            </Grid>
        </Grid>
    );
}