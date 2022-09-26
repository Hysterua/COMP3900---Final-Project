import React, {useState} from 'react';
import {CircularProgress, Grid, Typography} from '@mui/material';
import {DesignerColumnSeparator} from '../mui-helpers/grid-spacers';

/**
 * @name LoadingResults
 * @description This component renders the loading animation used throughout the platform
 * @returns A LoadingResultsComponent
 */
export const LoadingResults = () => {

    const [title, setTitle] = useState("Loading...");
    const [phase, setPhase] = useState(true);

    setTimeout(() => {
        if (phase){setTitle("Loading..."); setPhase(false);}
        else {setTitle("Loading......"); setPhase(true);}
    }, 800);

    return (
        <Grid item xs={12} sx={{m:2}}>
            <DesignerColumnSeparator xs={1} />
            <Typography variant="h5" sx={{fontWeight: 'bold', fontStyle: 'italic'}}>
                {title}
            </Typography>
        </Grid>
    );
}