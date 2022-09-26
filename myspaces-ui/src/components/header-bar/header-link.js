import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { checkCookie } from '../../authentication/user-cookie-management';

const headers = ["List A Space", "View My Listings", "View My Bookings"];
const adminHeaders = ["Admin"]

/**
 * @name HeaderLinks
 * @description Renders all of the required links depending on admin authentication
 * @returns All the required header links as per authorisation as button elements
 */
export const HeaderLinks = () => {
    return (
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {headers.map((head) => (
                <Button
                    key={head}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                >
                <Link style={{textDecoration: "none", color: "white"}} to={`/${head}`}>
                    {head}
                    </Link>
                </Button>
            ))}
            {checkCookie('IsAdmin') ?
                adminHeaders.map((head) => (
                    <Button
                        key={head}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                    <Link style={{textDecoration: "none", color: "white"}} to={`/${head}`}>
                        {head}
                    </Link>
                    </Button>
                )) :
                (null)
            }
         </Box> 
    );
}