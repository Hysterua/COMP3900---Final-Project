import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import MuiAlert from "@mui/material/Alert";
import {TextField, Box, Grid, Container, Card, CardMedia, Typography, Stack, Button, Checkbox, Link} from '@mui/material';
import {fetchAuthorisedUserID} from '../../authentication/user-cookie-management'
import { mySpacesAPIPOST, mySpacesAPIGET } from "../../my-spaces-api/call-my-spaces-api";
import { LoadingResults } from '../../components/loading-animation/loading-animation';


/* For AT3900-292 UI Refactoring - Replace this with the error alert component please */
function Alert(props) {
    return <MuiAlert elevation={1} variant="filled" {...props} />;
}

/**
 * @name SpaceRegistrationMarkHidden
 * @description Component that designs the UI to display the hidden property on the space registration page
 * @param {hidden boolean, function to set hidden value}
 * @returns A SpaceRegistrationMarkHidden Component
 */
const SpaceRegistrationMarkHidden = ({hidden, setHidden}) => {

    const switchHidden = () => {
        if (hidden){setHidden(false);}
        else {setHidden(true);}
    }

    return (
        <Grid container item alignItems="center" justifyContent="center" xs={12}>
            <Typography gutterBottom variant="h6" component="div">
                Mark Listing as Hidden from platform
            </Typography>
            <Checkbox checked={hidden} onChange={switchHidden}/>
        </Grid>
    );
}

/**
 * @name SpaceRegistrationPage
 * @description Designs all the UI for the Space Registration Page on the platform
 - A user can enter all the required fields into the space registration page
 - If a user misses any of the required fields, they are notified
 - A user can save the listing once they have filled all the details correctly
 * @returns A SpaceRegistrationPage Component
 */
export const SpaceRegistrationPage = () => {

    const [querying, setQuerying] = useState(true);
    const [providerResponse, setProviderResponse] =  useState({
        payload: {
            BSB: null,
            AccountNum: null
        }
    });

    const [streetNumberData, setStreetNumberData] = useState(String);
    const [streetData, setStreetData] = useState(String);
    const [suburbData, setSuburbData] = useState(String);
    const [postcodeData, setPostcodeData] = useState(String);
    const [costData, setCostData] = useState(String);
    const [descriptionData, setDescriptionData] = useState(String);
    const [depthData, setDepthData] = useState(String);
    const [widthData, setWidthData] = useState(String);
    const [heightData, setHeightData] = useState(String);
    const [hiddenData, setHiddenData] = useState(false);
    
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (querying){handleProviderValidation();}
    });

    const handleProviderValidation = () => {
        const userID = fetchAuthorisedUserID();
        mySpacesAPIGET(`/user/${userID}`,setError,setProviderResponse,setQuerying);
    }

    const handleNewCarSpaceRegistration = () => {
    
        if (!streetNumberData || !streetData || !suburbData || !postcodeData || !costData || !depthData || !heightData || !widthData){
            setError('Please make sure all required fields are filled!');
            return;
        }
        
        const callback = () => {
            navigate("/View%20My%20Listings");
            document.location.reload();
        }
        
        mySpacesAPIPOST("/listings", JSON.stringify({
            ListedBy: fetchAuthorisedUserID(),
            HourlyPrice: costData,
            Notes: descriptionData,
            StreetNumber: streetNumberData,
            Street: streetData,
            Suburb: suburbData,
            PostCode: postcodeData,
            Width: widthData,
            Height: heightData,
            Depth: depthData,
            Visible: !hiddenData
        }), setError, callback);
        
    }

    return (
        <Container maxWidth="md">
            <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1.5},
                p: 2
            }}
            noValidate
            autoComplete="off"
            >
                {error && (
                    <Alert severity="error" onClick={() => setError(null)}>
                    {error}
                    </Alert>
                )}
                
                { querying ?
                <LoadingResults />
                :
                !!providerResponse.payload.BSB && !!providerResponse.payload.AccountNum?
                <Grid container item xs ={12}>
                <Grid item xs={12}>
                    <br/>
                    <Typography gutterBottom variant="h5" component="div">
                        List a Car Space
                    </Typography>
                    <br/>
                </Grid>
                
                <Grid 
                container 
                spacing={2}
                alignItems="center"
                justifyContent="center"
                >

                    <Grid item xs = {5}>
                        <Stack spacing={1}>
                            <TextField
                                required
                                id="outlined-required"
                                label="Street Number"
                                value={streetNumberData}
                                onChange={(e) => setStreetNumberData(e.target.value)}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Street"
                                value={streetData}
                                onChange={(e) => setStreetData(e.target.value)}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Suburb"
                                value={suburbData}
                                onChange={(e) => setSuburbData(e.target.value)}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Postcode"
                                value={postcodeData}
                                onChange={(e) => setPostcodeData(e.target.value)}
                            />
                            <TextField
                                required
                                id="outlined-required"
                                label="Cost $/HR"
                                value={costData}
                                onChange={(e) => setCostData(e.target.value)}
                            />
                        </Stack>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6" component="div">
                            <br/>
                            Dimensions of Car Space (Metres)
                        </Typography>
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Depth"
                            value={depthData}
                            onChange={(e) => setDepthData(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Width"
                            value={widthData}
                            onChange={(e) => setWidthData(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Height"
                            value={heightData}
                            onChange={(e) => setHeightData(e.target.value)}
                        />
                    </Grid>
                    
                    <SpaceRegistrationMarkHidden hidden={hiddenData} setHidden={setHiddenData}/>

                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h6" component="div">
                            Enter A Car Spot Description
                        </Typography>
                    </Grid>


                    <Grid item xs={12}>
                        <TextField
                                    fullWidth
                                    id="outlined-multiline-static"
                                    label="Description"
                                    multiline
                                    rows={8}
                                    value={descriptionData}
                                    onChange={(e) => setDescriptionData(e.target.value)}
                                />
                    </Grid>

                    <Grid item xs={12}>
                        <Button variant="contained" onClick={handleNewCarSpaceRegistration}>
                            Confirm Listing
                        </Button>
                    </Grid>
                </Grid> 
                </Grid>:
                <Grid container item xs={12}>
                    <Grid item xs={12} >
                        <Typography variant="h6" sx={{fontStyle: 'italic', m:2}}>
                            {"Please enter your bank details at your my account page "}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => {navigate("/My%20Account")}}>
                            To My Account Page
                        </Button>
                    </Grid>
                </Grid>}
            </Box>
        </Container>
    );  
}