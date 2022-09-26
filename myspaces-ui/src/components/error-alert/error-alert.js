import React from 'react';
import MuiAlert from "@mui/material/Alert";

/**
 * @name ErrorAlert
 * @description This component is rendered as an error prompt shown to the user
 * @param {*} props 
 * @returns A MuiAlert component from Material UI
 */
export const ErrorAlert = (props) => {
    return <MuiAlert elevation={1} variant="filled" {...props} />;
}
