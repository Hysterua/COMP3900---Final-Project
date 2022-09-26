import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import { Button, Typography } from "@mui/material";
import { LoadingResults } from "../../components/loading-animation/loading-animation";
import { DeleteButton, EditButton } from "../../components/utility/utilities";
import { mySpacesAPIGET, mySpacesAPIPUT } from "../../my-spaces-api/call-my-spaces-api";
import { ErrorAlert } from "../../components/error-alert/error-alert";
import { DesignerColumnSeparator, DesignerRowSeparator } from "../../components/mui-helpers/grid-spacers";
import { ListingForm } from "../../forms/listing-form";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


/**
 * @name SingleUser
 * @description This component renders a single user from within the list of users component
 * @param { FirstName, LastName, UserID, Email, PhoneNo, IsAdmin }
 * @returns A SingleUserComponent
 */
const SingleUser = ({ FirstName, LastName, UserID, Email, PhoneNo, IsAdmin }) => {
    return (
        <Grid container item xs={12} >
          <Grid item xs={2} />
          <Grid container item xs={8} sx={IsAdmin ? {border: 1, borderColor: "#ffd700" } : {}}>
                <Grid
                    item
                    xs={6}
                    sm={3}
                    component={Typography}
                    variant="h6"
                    sx={{ fontStyle: "italic" }}
                    align={"left"}
                >
                    {FirstName} {LastName}
                </Grid>
                <Grid
                    item
                    xs={6}
                    sm={3}
                    component={Typography}
                    variant="h6"
                    sx={{ fontStyle: "italic" }}
                    align={"left"}
                >
                    #{UserID}
                </Grid>
            <Grid item xs={0} sm={6} />
                <Grid
                    item
                    xs={12}
                    component={Typography}
                    variant="h6"
                    sx={{ fontStyle: "italic" }}
                    align={"left"}
                >
                    {Email}
                </Grid>
                <Grid
                    item
                    xs={12}
                    component={Typography}
                    variant="h6"
                    sx={{ fontStyle: "italic" }}
                    align={"left"}
                >
                    {PhoneNo}
                </Grid>
            </Grid>
        </Grid>
    );
};

/**
 * @name UserList
 * @description This component renders a list of users given that the users tab is selecetd
 * @param {list of users} 
 * @returns A UserList Component
 */
const UserList = ({ users, refresh }) => {
    if (!users || users.length === 0) {
        return <Grid item> No users </Grid>;
    }

    return (
        <Grid container item xs={10} rowSpacing={2} sx={{m:1}}>
            {users.map((user) => (
                <Grid container item xs={10} key={user.UserID}>
                    <SingleUser
                        FirstName={user.FirstName}
                        LastName={user.LastName}
                        UserID={user.UserID}
                        Email={user.Email}
                        PhoneNo={user.PhoneNo}
                        IsAdmin={user.IsAdmin}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

/**
 * @name SingleBooking
 * @description This component renders a single booking from within the list of bookings.
 * @param {BookedSpace, starttime, endtime, cost} 
 * @returns A SingleBooking Component
 */
const SingleBooking = ({ BookedSpace, StartTime, EndTime, Cost }) => {
    return (
        <Grid container item xs={12}>
          <Grid item xs={2} />
          <Grid container item xs={10}>
            <Grid container item xs={6}>
                    <Grid
                        item
                        xs={12}
                        component={Typography}
                        variant="h6"
                        sx={{ fontStyle: "italic" }}
                        align={"left"}
                        >
                        Booked Space: {BookedSpace}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        component={Typography}
                        variant="h6"
                        sx={{ fontStyle: "italic" }}
                        align={"left"}
                        >
                        ${Cost}
                    </Grid>
                </Grid>
                <Grid container item xs={6}>
                    <Grid
                        item
                        xs={12}
                        component={Typography}
                        variant="h6"
                        sx={{ fontStyle: "italic" }}
                        align={"left"}
                        >
                        {StartTime}
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        component={Typography}
                        variant="h6"
                        sx={{ fontStyle: "italic" }}
                        align={"left"}
                        >
                        {EndTime}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

/**
 * @name BookingsList
 * @description This component renders a list of bookings when it's tab is selected.
 * @param {list of bookings}
 * @returns A BookingsList Component
 */
const BookingList = ({ bookings, refresh }) => {
    if (!bookings || bookings.length === 0) {
        return <Grid item> No bookings </Grid>;
    }

    return (
        <Grid container item xs={10} rowSpacing={2} sx={{m:1}}>
            {bookings.map((booking) => (
                <Grid container item xs={12} key={booking.BookingID}>
                    <Grid container item xs={10}>
                        <SingleBooking
                            BookedSpace={booking.BookedSpace}
                            StartTime={booking.StartDate}
                            EndTime={booking.EndDate}
                            Cost={booking.TotalCost}
                        />
                    </Grid>
                    <Grid container item xs={2}>
                        <DeleteButton item={'booking'} itemID={booking.BookingID} onDelete={refresh}/>
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

/**
 * @name SingleListing
 * @description This component renders a single listing and it called within the list of listings
 * @param {address, cost}  
 * @returns A SingleListingComponent
 */
const SingleListing = ({ Address, Cost}) => {
    return (
        <Grid container item xs={12}>
          <Grid item xs={2} />
          <Grid container item xs={10}>
                <Grid
                    item
                    xs={6}
                    component={Typography}
                    variant="h6"
                    sx={{ fontStyle: "italic" }}
                    align={"left"}
                    >
                    {Address}
                </Grid>
                <Grid
                    item
                    xs={6}
                    component={Typography}
                    variant="h6"
                    sx={{ fontStyle: "italic" }}
                    align={"left"}
                    >
                    ${Cost}/hr
                </Grid>
            </Grid>
        </Grid>
    );
};

/**
 * @name ListingsList
 * @description This component renders the list of listings when it's tab is selected
 * @param {list of listings} param0 
 * @returns A ListingsList Component
 */
const ListingsList = ({ listings, refresh }) => {
    
    const [editListing, setEditListing] = useState(null);

    if (!listings || listings.length === 0) {
        return <Grid item> No listings </Grid>;
    }

    return (
        <Grid container item xs={10} rowSpacing={2} sx={{m:2}}>
            {listings.map((listing) => (
                <Grid container item xs={12} key={listing.ListingID}>
                    <Grid container item xs={10} sx={listing.Deleted ? {backgroundColor: "#f7f7f7"} : (null)}>
                        <SingleListing
                            Address={listing.StreetNumber + " " + listing.Street + " " + listing.Suburb}
                            Cost={listing.HourlyPrice}
                        />
                        {listing.Deleted ?
                            <Grid
                                item
                                xs={12}
                                component={Typography}
                                variant="h6"
                                sx={{ fontStyle: "italic" }}
                                align={"left"}
                            >
                                DELETED
                            </Grid> :
                            (null)}
                    </Grid>
                    {listing.Deleted ?
                        (null) :
                        <Grid container item xs={2} rowSpacing={1}>
                            <EditButton onClick={() => {setEditListing(listing)}}/>
                            <DeleteButton item={'listing'} itemID={listing.ListingID} onDelete={refresh}/>
                        </Grid>}
                </Grid>
            ))}
            <Dialog 
                open={editListing != null} 
                onClose={() => {
                    setEditListing(null);
                }}
            >
                <DialogTitle align={"center"} sx = {{m : 2}}>
                    Edit Listing
                </DialogTitle>
                <DialogContent>
                    { editListing != null ?
                        <ListingForm 
                            listing={editListing} 
                            mySpacesAPIREQUEST={mySpacesAPIPUT} 
                            onSuccess={() => {
                                setEditListing(null);
                                refresh();
                            }}/> :
                        (null)
                    }
                </DialogContent>
            </Dialog>
        </Grid>
    );
};

/**
 * @name OptionalList
 * @description This component renders the specific type of data based on the Showing Enum
 * @param {showing parameter, the list of datapoints} 
 * @returns An OptionalList Component
 */
const OptionalList = ({ showing, list, refresh }) => {
    switch (showing) {
        case Showing.Users:
            return <UserList users={list.sort((a, b) => (a.UserID > b.UserID ? 1 : -1))} refresh={refresh}/>;
        case Showing.Bookings:
            return <BookingList bookings={list.sort((a, b) => (a.BookingID > b.BookingID ? 1 : -1))} refresh={refresh}/>;
        case Showing.Listings:
            return <ListingsList listings={list.sort((a, b) => (a.ListingID > b.ListingID ? 1 : -1))} refresh={refresh}/>;
        default: break;
    }
};

const Showing = {
    Users: "Users",
    Bookings: "Bookings",
    Listings: "Listings"
};

/**
 * @name AdminPage
 * @description Designs the UI and Functionality of the Main Admin Dashboard
 - As an admin, you can view all of the listings on the platform from the listings tab
 - As an admin, you can view all the bookings on the platform from the bookings tab
 - As an admin, you can view all the users on the platform from the users tab
 * @returns An AdminPage Component
 */
export const AdminPage = () => {
    const [showing, setShowing] = useState(Showing.Users);
    
    const [response, setResponse] = useState({
        payload: []
    })

    const [querying, setQuerying] = useState(true);

    const [error, setError] = useState(null);
 
    useEffect(() => {
        refreshList();
    }, [showing]);

    const refreshList = () => {
        if (showing === Showing.Users) {
            mySpacesAPIGET('/user/', setError, setResponse, setQuerying);
        } else if (showing === Showing.Bookings) {
            mySpacesAPIGET(`/bookings`, setError, setResponse, setQuerying);
        } else if (showing === Showing.Listings) {
            mySpacesAPIGET(`/listings`, setError, setResponse, setQuerying);
        }
    }

    return (
        <Grid container>
        
            {!error ? (null) : 
                <Grid container item xs={12} alignItems='left'>
                    <DesignerColumnSeparator xs={1} />
                    <ErrorAlert fullWidth severity="error" onClick={() => setError(null)}>
                        {error}
                    </ErrorAlert>
                </Grid>
            }
            
            <Grid item xs={0} sm={1} />
            
            <Grid container item xs>
                <Grid container item xs={12} sm={9} md={6}>
                <Grid
                    item
                    xs
                    component={Button}
                    sx={{
                        backgroundColor: "#f7f7f7",
                        border: 2,
                        borderBottom: showing === Showing.Users ? 0 : undefined,
                        borderRadius: 0,
                        borderTopLeftRadius: 10,
                        borderColor: "#b8b8b8"
                    }}
                    onClick={() => {
                        if (showing !== Showing.Users) {
                            setQuerying(true);
                            setShowing(Showing.Users);
                        }
                    }}
                >
                    Users
                </Grid>
                <Grid
                    item
                    xs
                    component={Button}
                    sx={{
                        backgroundColor: "#f7f7f7",
                        border: 2,
                        borderBottom: showing === Showing.Listings ? 0 : undefined,
                        borderRadius: 0,
                        borderTopLeftRadius: 10,
                        borderColor: "#b8b8b8"
                    }}
                    onClick={() => {
                        if (showing !== Showing.Listings) {
                            setQuerying(true);
                            setShowing(Showing.Listings);
                        }
                    }}
                >
                    Listings
                </Grid>
                <Grid
                    item
                    xs
                    component={Button}
                    sx={{
                        backgroundColor: "#f7f7f7",
                        border: 2,
                        borderBottom: showing === Showing.Bookings ? 0 : undefined,
                        borderRadius: 0,
                        borderTopLeftRadius: 10,
                        borderColor: "#b8b8b8"
                    }}
                    onClick={() => {
                        if (showing !== Showing.Bookings) {
                            setQuerying(true);
                            setShowing(Showing.Bookings);
                        }
                    }}
                >
                    Bookings
                </Grid>
                </Grid>
                <Grid
                    item
                    xs={0}
                    sm={3}
                    md={6}
                    sx={{
                        border: 0,
                        borderBottom: 2,
                        borderColor: "#b8b8b8"
                    }}
                />
                <Grid
                    container
                    item
                    xs={12}
                    sx={{
                        backgroundColor: "#f7f7f7",
                        border: 2,
                        borderTop: 0,
                        borderColor: "#b8b8b8"
                    }}
                >
                    <Grid
                        container
                        item
                        xs={12}
                        sx={{
                            backgroundColor: "#FFFFFF"
                        }}
                    >
                        <Grid item xs />
                        {querying ? 
                            <LoadingResults/> : 
                            <OptionalList showing={showing} list={response.payload} refresh={refreshList}/>}
                        <Grid item xs />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={0} sm={1} />
        </Grid>
    );
}