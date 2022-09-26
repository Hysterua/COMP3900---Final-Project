import React from 'react';
import {DesignerColumnSeparator} from '../mui-helpers/grid-spacers';
import {Grid, Typography} from '@mui/material';

/**
 * @name PrimaryTitle
 * @description This component renders a general title style for the platform
 * @param {title string} 
 * @returns A PrimaryTitle Component
 */
export const PrimaryTitle = ({title}) => {
    return (
        <Grid container item xs={6}>
        
            <DesignerColumnSeparator xs={2} />
            <Typography align={'left'} variant="h5" sx={{fontWeight: 'bold'}}>
                {title}
            </Typography>
        </Grid>
    );
}

/**
 * @name SecondaryTitle
 * @description This component renders a smaller title style than the primary title, used throughout the platform
 * @param {title string} 
 * @returns A SecondaryTitle Component
 */
export const SecondaryTitle = ({title}) => {
    return (
        <Grid container item xs={6}>
        
            <DesignerColumnSeparator xs={2} />
            <Typography align={'left'} variant="h6" sx={{fontWeight: 'bold'}}>
                {title}
            </Typography>
        </Grid>
    );
}