import React, {useEffect, useState} from 'react';
import {Grid, Typography, TextField, Checkbox, Button, Dialog, DialogTitle, DialogContent} from '@mui/material';
import {DesignerRowSeparator, DesignerColumnSeparator} from '../../components/mui-helpers/grid-spacers';
import {LoadingResults} from "../../components/loading-animation/loading-animation";
import { PrimaryTitle, SecondaryTitle } from '../../components/page-title/page-title';
import { useNavigate } from "react-router-dom";
import {ErrorAlert} from '../../components/error-alert/error-alert';
import { mySpacesAPIDELETE, mySpacesAPIGET, mySpacesAPIPUT } from '../../my-spaces-api/call-my-spaces-api';

const DEFAULT_LISTING_ID = "--ERROR--";

/**
 * @name EditMyListingContentHeader
 * @description This component renders the listing picture, cost and notes sections of the edit page
 * @param {cost, notes, setCost, setNotes} 
 * @returns An EditMyListingContentHeader Component
 */
const EditMyListingContentHeader = ({cost, notes, setCost, setNotes}) => {
    return (
        <Grid container item align={'left'} xs={12} rowSpacing={1}>
        
            <SecondaryTitle title={"Cost"} />
            
            <DesignerRowSeparator />
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={4}>
                <TextField 
                    fullWidth 
                    required
                    label="Hourly Cost $AUD" 
                    defaultValue={`${cost}`}
                    variant="outlined" 
                    onChange={(event) => {setCost(event.target.value)}}
                />
            </Grid>
            
            <DesignerRowSeparator />
            
            <SecondaryTitle title={"Description"} />
            
            <DesignerRowSeparator />
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={9}>
                <TextField 
                    fullWidth 
                    multiline
                    rows={4}
                    label="Description" 
                    defaultValue={`${notes}`}
                    variant="outlined" 
                    onChange={(event) => {setNotes(event.target.value)}}
                />
            </Grid>
        </Grid>
    );
}

/**
 * @name EditMyListingContentAddress
 * @description This component renders all the street number, street, suburb and postcode input fields on the edit page
 * @param { streetNumber, street, suburb, postCode, setStreetNumber, setStreet, setSuburb, setPostCode}
 * @returns An EditMyListingContentAddress Component
 */
const EditMyListingContentAddress = ({
    streetNumber, 
    street, 
    suburb, 
    postCode,
    setStreetNumber,
    setStreet,
    setSuburb,
    setPostCode
}) => {
    return (
        <Grid container item align={'left'} xs={12} rowSpacing={1}>
        
            <SecondaryTitle title={"Address"} />
            
            <DesignerRowSeparator />
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={4}>
                <TextField 
                    fullWidth 
                    required
                    label="Street Number" 
                    defaultValue={`${streetNumber}`}
                    variant="outlined" 
                    onChange={(event) => {setStreetNumber(event.target.value)}}
                />
            </Grid>
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={4}>
                <TextField 
                    fullWidth 
                    required
                    label="Street Name" 
                    defaultValue={`${street}`}
                    variant="outlined" 
                    onChange={(event) => {setStreet(event.target.value)}}
                />
            </Grid>
            
            <DesignerRowSeparator />
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={4}>
                <TextField 
                    fullWidth 
                    required
                    label="Suburb" 
                    defaultValue={`${suburb}`}
                    variant="outlined" 
                    onChange={(event) => {setSuburb(event.target.value)}}
                />
            </Grid>
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={4}>
                <TextField 
                    fullWidth 
                    required
                    label="Post Code" 
                    defaultValue={`${postCode}`}
                    variant="outlined" 
                    onChange={(event) => {setPostCode(event.target.value)}}
                />
            </Grid>
            
            
        </Grid>
    );
}

/**
 * @name EditMyListingContentMarkHidden
 * @description This component renders the mark hidden title and the checkbox for this listing property
 * @param {hidden boolean, function to set hidden property} 
 * @returns An EditMyListingContentMarkHidden COmponent
 */
const EditMyListingContentMarkHidden = ({hidden, setHidden}) => {

    const switchHidden = () => {
        if (hidden){setHidden(false);}
        else {setHidden(true);}
    }

    return (
        <Grid container item align={'left'} xs={12} >
            <SecondaryTitle title={"Mark Hidden From Listings"} />
            <Checkbox checked={hidden} onChange={switchHidden}/>
        </Grid>
    );
}

/**
 * @name EditMyListingContentDimensions
 * @description This component renders the dimensions input fields on the edit page
 * @param {width, depth, height, function to set width, function to set depth, function to set height} 
 * @returns An EditMyListingContentDimensions Component
 */
const EditMyListingContentDimensions = ({width, depth, height, setWidth, setDepth, setHeight}) => {
    return (
        <Grid container item align={'left'} xs={12} rowSpacing={1}>
            <SecondaryTitle title={"Dimensions"} />
            
            <DesignerRowSeparator />
            
            <DesignerColumnSeparator xs={1} />
            
            <Grid item xs={3}>
                <TextField 
                          required
                          label="Width (cm)" 
                          defaultValue={`${width}`}
                          variant="outlined" 
                          onChange={(event) => {setWidth(event.target.value)}}
                      /> 
            </Grid>
            
            <Grid item xs={3}>
                <TextField 
                          required
                          label="Depth (cm)" 
                          defaultValue={`${depth}`}
                          variant="outlined" 
                          onChange={(event) => {setDepth(event.target.value)}}
                      /> 
            </Grid>
            
            <Grid item xs={3}>
                <TextField 
                          required
                          label="Height (cm)" 
                          defaultValue={`${height}`}
                          variant="outlined" 
                          onChange={(event) => {setHeight(event.target.value)}}
                      /> 
            </Grid>

        </Grid>
    );
}

/**
 * @name EditDeletePrompt
 * @description This prompt controls the deleting process of a listing.  It allows the user to see a prompt asking them to confirm the deletion
 * @param {boolean indicating prompt display, function to change display boolean, handle event function on delete confirmation} 
 * @returns An EditDeletePrompt Component
 */
const EditDeletePrompt = ({display, setDisplay, handleDelete}) => {  
    return (
        <Dialog open={display}>
            <DialogTitle>
                Are you sure you want to delete this listing?
            </DialogTitle>
            <DialogContent>
                <Button variant="container" sx={{backgroundColor: 'red'}} onClick={handleDelete}>
                    CONFIRM DELETE
                </Button>
                <Button align={'right'} variant="container" onClick={() => {setDisplay(false);}}>
                    Never Mind!
                </Button>
            </DialogContent>
        </Dialog>
    );
}

/**
 * @name EditSuccessPrompt
 * @description This component is a success prompt that renders when the user saves any new listing data in the edit page
 * @param {boolean indicating whether to display prompt, function to change display boolean} 
 * @returns An EditSuccessPrompt Component
 */
const EditSuccessPrompt = ({display, setDisplay}) => {
    let navigate = useNavigate();
    return (
        <Dialog open={display}>
            <DialogTitle>
                Your changes were saved!
            </DialogTitle>
            <DialogContent>
                <Button variant="container" sx={{backgroundColor: 'lightgreen'}} onClick={() => {setDisplay(false); navigate("/View%20My%20Listings");}}>
                    OK
                </Button>
                <Button variant="container" onClick={() => {setDisplay(false);  }}>
                    continue editing
                </Button>
            </DialogContent>
        </Dialog>
    );
}

/**
 * @name EditMyListingContentButtons
 * @description This component designs the UI for the DELETE and SAVE buttons on the edit page.
 * @param {all updated user fields as JSON, the listing ID} 
 * @returns An EditMyListingContentButtons Component
 */
const EditMyListingContentButtons = ({handleEdit, setDeletePrompt}) => {

    return (
        <Grid container item xs={12} rowSpacing={5}>
            <DesignerRowSeparator />
            
            <Grid item xs={6}>
                <Button variant="contained" sx={{backgroundColor: 'red'}} onClick={() => {setDeletePrompt(true)}}>
                    DELETE
                </Button>
            </Grid>
            
            <Grid item xs={6}>
                <Button variant="contained" onClick={handleEdit}>
                    SAVE
                </Button>
            </Grid>
        </Grid>
    );
}
    
/**
 * @name EditMyListingContent
 * @description When the API returns back a successful code, this component is rendered to the user.
 * @param {listing details} 
 * @returns An EditMyListingContent Component
 */
const EditMyListingContent = ({listing}) => {

    const [cost, setCost] = useState(listing.HourlyPrice);
    const [notes, setNotes] = useState(listing.Notes)
    const [streetNumber, setStreetNumber] = useState(listing.StreetNumber);
    const [street, setStreet] = useState(listing.Street);
    const [suburb, setSuburb] = useState(listing.Suburb);
    const [postCode, setPostCode] = useState(listing.PostCode);
    const [width, setWidth] = useState(listing.Width);
    const [depth, setDepth] = useState(listing.Depth);
    const [height, setHeight] = useState(listing.Height);
    const [hidden, setHidden] = useState(!listing.Visible);
    
    const [error, setError] = useState("");
    
    const [editSuccess, setEditSuccess] = useState(false);
    const [editDelete, setEditDelete] = useState(false);
    
    let navigate = useNavigate();
    
    const handleEdit = () => {
    
        if (!cost || !streetNumber || !street || !suburb || !postCode|| !width || !depth || !height) {
            setError("All Fields are Required");
            return; 
        }
            
        mySpacesAPIPUT("/listings", JSON.stringify({
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
    
    const handleDelete = () => {
        const callback = () => {
            setEditDelete(false);
            navigate("/View%20My%20Listings");
        }

        mySpacesAPIDELETE(`/listings/${listing.ListingID}`, callback);
    
    }
    
    return (
        <Grid container item xs={12} rowSpacing={2}>
        
            {!error ? (null) :
                <Grid container item >
                    <DesignerColumnSeparator xs={1} />
                    <ErrorAlert severity="error" onClick={() => setError(null)}>
                        {error}
                    </ErrorAlert>
                </Grid>
            
            }
            
            <DesignerRowSeparator />
            <EditMyListingContentHeader 
                cost={cost}
                notes={notes}
                setCost={setCost}
                setNotes={setNotes}
            />
            
            <DesignerRowSeparator />
            <EditMyListingContentAddress 
                streetNumber={streetNumber}
                street={street}
                suburb={suburb}
                postCode={postCode}
                setStreetNumber={setStreetNumber}
                setStreet={setStreet}
                setSuburb={setSuburb}
                setPostCode={setPostCode}
            />
            
            <DesignerRowSeparator />
            <EditMyListingContentMarkHidden hidden={hidden} setHidden={setHidden}/>
            
            <DesignerRowSeparator />
            <EditMyListingContentDimensions 
                width={width}
                depth={depth}
                height={height} 
                setWidth={setWidth}
                setDepth={setDepth}
                setHeight={setHeight}
            />
            
            <EditMyListingContentButtons 
                handleEdit={handleEdit}
                setDeletePrompt={setEditDelete}    
            />
            
            <DesignerRowSeparator />
            <DesignerRowSeparator />
            
            <EditSuccessPrompt display={editSuccess} setDisplay={setEditSuccess} />
            <EditDeletePrompt display={editDelete} setDisplay={setEditDelete} handleDelete={handleDelete}/>
        
        </Grid>
    );
}
    
/**
 * @name EditMyListingError
 * @description If the API returns back an error code, this component is rendered to the user
 * @returns An EditMyListingError Component
 */
const EditMyListingError = () => {
    return (
        <Grid item xs={6}>
            <Typography variant="h6" sx={{fontStyle: 'italic'}}>
                {"Something went wrong :( "}
            </Typography>
        </Grid>
    );
}
 
/**
 * @name EditMyListingResults
 * @description When the API returns results, this component is rendered to the user view
 * @param {response object} 
 * @returns An EditMyListingResults Component
 */
const EditMyListingResults = ({response}) => {
    if (!response.payload){return <EditMyListingError />}
    else {return <EditMyListingContent listing={response.payload}/>}
}

/**
 * @name EditMyListingPage
 * @description Designs the UI and Functionality for the Edit My Listings Page
 - A user can edit all of the fields on a listing
 - A user initially see's all defaulted fields appearing inside the edit boxes
 - A user has the option to delete a listing from the page
 - A user can choose to save changes to the edited listing
 * @returns An EditMyListingPage Component
 */
export const EditMyListingPage = () => {

    const [listingID, setListingID] = useState("");
    const [querying, setQuerying] = useState(true);
    const [response, setResponse] = useState({
        payload: null
    })
    
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!querying){return;}
        
        const queryURLSearch = (new URL(document.location)).searchParams.get('listingID');
        if (!queryURLSearch || queryURLSearch === ''){setListingID(DEFAULT_LISTING_ID);}
        else {setListingID(queryURLSearch);}
        
        if (!listingID || listingID === DEFAULT_LISTING_ID){return;}
        mySpacesAPIGET(`/listings/${listingID}`, setError, setResponse, setQuerying)
    });

    return (
        <div className="edit-my-listing-page">
            <Grid container rowSpacing={5} columnSpacing={{xs: 1}}>
            
            <DesignerRowSeparator />
            
                <Grid container item xs={10}>
                    <PrimaryTitle title={"Edit My Listing"} />
                </Grid>
                
                {!error ? (null) : 
                    <Grid container item xs={12} alignItems='left'>
                        <DesignerColumnSeparator xs={2} />
                        <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                            {error}
                        </ErrorAlert>
                    </Grid>
                }
                
                {querying ? <LoadingResults /> : <EditMyListingResults response={response} />}
                
            </Grid>
        
        </div>
    );
}