import { React, useState } from 'react';
import { Grid, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { mySpacesAPIDELETE } from '../../my-spaces-api/call-my-spaces-api';


/**
 * @title DeletePrompt
 * @description This component renders the delete prompt if the user selects the delete button
 * @param {displayed, setDisplayed, item, itemID}
 * @returns A DeletePrompt Component
 */
 const DeletePrompt = ({displayed, setDisplayed, item, itemID, onDelete}) => {

    const callback = () => {
        setDisplayed(false);
        onDelete();
    }

    return (
        <Dialog open={displayed} onClose={() => {setDisplayed(false);}}>
            <DialogTitle>
                Are you sure you want to delete this {item}?
            </DialogTitle>
            <DialogContent>
                <Button 
                    variant="container" 
                    sx={{backgroundColor: 'red'}} 
                    onClick={() => {mySpacesAPIDELETE(`/${item}s/${itemID}`, callback)}}
                >
                    CONFIRM DELETE
                </Button>
                <Button 
                    align={'right'}
                    variant="container" 
                    onClick={() => {
                        setDisplayed(false);   
                    }}>
                    Never Mind!
                </Button>
            </DialogContent>
            
        </Dialog>
    );
}


export const DeleteButton = ({item, itemID, onDelete}) => {

    const [deletePrompt, setDeletePrompt] = useState(false);

    return (
        <Grid container item xs={12}>
            <Grid 
                item 
                xs={12}
                sx={{backgroundColor: 'red'}} 
                component={Button}
                variant="contained" 
                onClick={() => {setDeletePrompt(true)}}
            >
                DELETE
            </Grid>
            <DeletePrompt displayed={deletePrompt} setDisplayed={setDeletePrompt} item={item} itemID={itemID} onDelete={onDelete}/>
        </Grid>

    );
}

export const EditButton = ({onClick}) => {

    return (
        <Grid 
            item 
            xs={12}
            component={Button} 
            variant="contained"
            onClick={onClick}
        >
            EDIT
        </Grid>
    );
}

export const SubmitButton = ({onClick}) => {

    return (
        <Grid 
            item 
            xs={12}
            component={Button} 
            variant="contained"
            onClick={onClick}
        >
            SUBMIT
        </Grid>
    );
}