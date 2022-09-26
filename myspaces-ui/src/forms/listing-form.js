import React, { useState, useEffect } from "react"
import {TextField, Grid, Checkbox, Typography} from '@mui/material';
import { fetchAuthorisedUserID } from "../authentication/user-cookie-management";
import { SubmitButton } from "../components/utility/utilities";
import { DesignerRowSeparator } from "../components/mui-helpers/grid-spacers";

const emptyListing = {
    HourlyPrice: "",
    Notes: "",
    StreetNumber: "",
    Street: "",
    Suburb: "",
    PostCode: "",
    Width: "",
    Height: "",
    Depth: "",
    Visible: true,
    ListedBy: fetchAuthorisedUserID(),
    ListingID: null
}

export const ListingForm = ({listing = emptyListing, mySpacesAPIREQUEST, onSuccess = () => {}}) => {

    const [cost, setCost] = useState(listing.HourlyPrice);
    const [notes, setNotes] = useState(listing.Notes)
    const [streetNumber, setStreetNumber] = useState(listing.StreetNumber);
    const [street, setStreet] = useState(listing.Street);
    const [suburb, setSuburb] = useState(listing.Suburb);
    const [postCode, setPostCode] = useState(listing.PostCode);
    const [width, setWidth] = useState(listing.Width);
    const [height, setHeight] = useState(listing.Height);
    const [depth, setDepth] = useState(listing.Depth);
    const [hidden, setHidden] = useState(!listing.Visible);
    
    const [error, setError] = useState("");
    
    const [editSuccess, setEditSuccess] = useState(false);
    
    useEffect(() => {
        if (editSuccess) onSuccess();
    }, [editSuccess]);

    const handleSubmit = () => {
    
        if (!cost || !streetNumber || !street || !suburb || !postCode|| !width || !depth || !height) {
            setError("All Fields are Required");
            return; 
        }
            
        mySpacesAPIREQUEST("/listings", JSON.stringify({
            ListingID: listing.ListingID,
            ListedBy: listing.ListedBy,
            HourlyPrice: cost,
            Notes: notes,
            StreetNumber: streetNumber,
            Street: street,
            Suburb: suburb,
            PostCode: postCode,
            Width: width,
            Height: height,
            Depth: depth,
            Visible: !hidden
        }), setError, setEditSuccess(true));
    }
    
    return (

        <Grid container item xs={12} rowSpacing={1} align={"center"} justifyContent="center">

            <Grid item xs={10} sx={{m:1}}>
                <TextField  
                    required
                    label="Hourly Cost $AUD" 
                    defaultValue={`${cost}`}
                    variant="outlined" 
                    onChange={(event) => {setCost(event.target.value)}}/>
            </Grid>

            <Grid item xs={12} sx={{m:1}}>
                <TextField 
                    multiline
                    rows={4}
                    label="Description" 
                    defaultValue={`${notes}`}
                    variant="outlined" 
                    onChange={(event) => {setNotes(event.target.value)}}/>
            </Grid>

            <DesignerRowSeparator/>

            <Grid item xs={12} component={Typography} variant="h6" sx={{m:2}}>
                Address:
            </Grid>

            <Grid item xs={5} sx={{m:1}}>
                <TextField  
                    required
                    label="Street Number" 
                    defaultValue={`${streetNumber}`}
                    variant="outlined" 
                    onChange={(event) => {setStreetNumber(event.target.value)}}
                />
            </Grid>

            <Grid item xs={5} sx={{m:1}}>
                <TextField 
                    required
                    label="Street Name" 
                    defaultValue={`${street}`}
                    variant="outlined" 
                    onChange={(event) => {setStreet(event.target.value)}}
                />
            </Grid>
            
            <Grid item xs={5} sx={{m:1}}>
                <TextField 
                    required
                    label="Suburb" 
                    defaultValue={`${suburb}`}
                    variant="outlined" 
                    onChange={(event) => {setSuburb(event.target.value)}}
                />
            </Grid>

            <Grid item xs={5} sx={{m:1}}>
                <TextField 
                    required
                    label="Post Code" 
                    defaultValue={`${postCode}`}
                    variant="outlined" 
                    onChange={(event) => {setPostCode(event.target.value)}}
                />
            </Grid>

            <Grid item xs={12} variant="h6" component={Typography} sx={{m:3}}>
                    Mark Hidden From Listings
                    <Checkbox checked={hidden} onChange={() => {setHidden(!hidden)}}/>
            </Grid>
            
            <Grid item xs={12} component={Typography} variant="h6" sx={{m:1}}>
                Dimensions
            </Grid>

            
            <Grid item xs={3} sx={{m:1}}>
                <TextField 
                        required
                        label="Width (cm)" 
                        defaultValue={`${width}`}
                        variant="outlined" 
                        onChange={(event) => {setWidth(event.target.value)}}
                    /> 
            </Grid>

            <Grid item xs={3} sx={{m:1}}>
                <TextField 
                        required
                        label="Height (cm)" 
                        defaultValue={`${height}`}
                        variant="outlined" 
                        onChange={(event) => {setHeight(event.target.value)}}
                    /> 
            </Grid>

            <Grid item xs={3} sx={{m:1}}>
                <TextField 
                        required
                        label="Depth (cm)" 
                        defaultValue={`${depth}`}
                        variant="outlined" 
                        onChange={(event) => {setDepth(event.target.value)}}
                    /> 
            </Grid>
 
            <Grid item xs={12} sx={{m:3}}>
                <SubmitButton onClick={handleSubmit}/>    
            </Grid>

        </Grid>
    );
  }