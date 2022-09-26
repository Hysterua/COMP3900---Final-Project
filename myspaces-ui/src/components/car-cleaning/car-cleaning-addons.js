import React, { useState } from 'react';
import { Grid, Typography, Card, CardContent, CardActionArea } from '@mui/material';


/**
 * @name FormatSingleAddon
 * @description This component is for creating and formatting a single addon class, additionally there 
 * Is some logic to make sure the buttons turn off and on as needed and the costs are passed back
 * @param {Title} The title of the car space that is being booked 
 * @returns A SpaceBookingTransitSummary
 */
const FormatSingleAddon = ({Title, Cost, Features, titleHolder, titleClicked, setCostOfAddon}) => {
    
    // This logic is for the buttons turning off and on when clicked and the prices updating accordingly 
    const toggleClicked = () => {

        if (isNaN(Cost.slice(1,)) === false) { setCostOfAddon(Cost.slice(1,)) }
        else { setCostOfAddon(0)}

        if (Title === titleHolder) {
            titleClicked(null)
            setCostOfAddon(0)
        } else {titleClicked(Title)}
    }

    return (
        <Grid container sx={{ m: 1.3 }}>                    
            <Grid item xs={12} align={'left'}>
                <Card align={'left'} style= {{backgroundColor: titleHolder === Title ? "#00BFFF" : "#F0F8FF"}} onClick={() => {
                    toggleClicked()
                }}>
                    <CardActionArea>
                        <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                        Schmicko Car Wash: {Title} - {Cost}
                        </Typography>

                        <Typography gutterBottom variant="body2" color="text.secondary">
                            Includes: {Features}
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid> 
    );
}

/**
 * @name CarCleaningAddonList
 * @desccription This component renders the list of add-ons available via our partner service
 * @param {list of addons, function to set the final cost of the addon} param0 
 * @returns A CarCleaningAddonList Component
 */
export const CarCleaningAddonList = ({addons, setCostOfAddon}) => {

    const [titleClicked, setTitleClicked] = useState(null)

    return (
        <Grid container item xs={12} rowSpacing={5}>
            {addons.map((addon) => (
                <FormatSingleAddon
                    Title={addon.Title}
                    Cost={addon.Cost}
                    Features={addon.Features}
                    titleHolder={titleClicked}
                    titleClicked={setTitleClicked}
                    setCostOfAddon={setCostOfAddon}
                />
            ))}
        </Grid>
    );
}