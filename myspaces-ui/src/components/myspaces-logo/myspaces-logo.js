import React from 'react';
import Typography from '@mui/material/Typography';
import { Commute } from '@mui/icons-material';

import './myspaces-logo.css';

/**
 * @name MySpacesLogo
 * @description Generates a component that illustrates the logo and name of our platform in the UI
 * @returns MySpacesLogo Component
 */
 export const MySpacesLogo = () => {
    return (
        <div className={'myspaces-logo'}>
            <MySpacesIcon />
            <MySpacesTitle />
        </div>
    );
}

/**
 * @name MySpacesIcon
 * @description Designs the Icon Component of the MySpacesLogo Component
 * @returns MySpacesIcon Component
 */
const MySpacesIcon = () => {
    return (          
        <Commute sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
    );
}

/**
 * @name MySpacesTitle
 * @description Designs the Title component of the MySpacesLogo Component
 * @returns MySpacesTitle Component
 */
const MySpacesTitle = () => {
    return ( 
        <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontWeight: 700,
            letterSpacing: '.1rem',
            color: 'inherit',
            textDecoration: 'none',
            }}
        >
            MySpaces
        </Typography>
    );
}