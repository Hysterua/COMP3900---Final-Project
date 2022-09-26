import React from 'react';

import {Grid, Typography} from '@mui/material'
import { DesignerColumnSeparator, DesignerRowSeparator } from '../mui-helpers/grid-spacers';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

/**
 * @name SocialsLikes
 * @description The social likes compnent renders the number of likes and the thumbs up icon in the socials component
 * @param {likes}
 * @returns A SocialsLikes Component
 */
export const SocialsLikes = ({likes}) => {
    return (
        <Grid container item rowSpacing={1} xs={6} >
            <DesignerRowSeparator />
            <Grid item align={'right'} xs={5}>
                <ThumbUpIcon sx={{color: '#2196f3'}}/>
            </Grid>
            <DesignerColumnSeparator xs={1} />
            <Grid item xs={6}>
                <Typography variant="h6" align={'left'} sx={{color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic'}}>
                    {likes}
                </Typography>
            </Grid>
        </Grid>
    );
}