import React from 'react';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { DesignerRowSeparator } from '../../mui-helpers/grid-spacers';
import {Grid} from '@mui/material';

/**
 * @name ReviewLikedFields
 * @description This component manages the like button inside the review prompt
 * @param {liked, setLiked} 
 * @returns A ReviewLikedField Component
 */
export const ReviewLikedField = ({liked, setLiked}) => {
    return (
        <Grid container item align={'left'} xs={3} rowSpacing={1}>
            <DesignerRowSeparator />
            {liked ? 
                <ThumbUpIcon sx={{color: '#2196f3'}} onClick={() => {setLiked(!liked)}}/>
            :
                <ThumbUpOffAltIcon sx={{color: '#2196f3'}} onClick={() => {setLiked(!liked)}}/>
            } 
        </Grid> 
    );
}