import React from 'react';

import {
    Grid, 
    Typography, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    Divider
} from '@mui/material'
import { DesignerRowSeparator } from '../mui-helpers/grid-spacers';
import ChatIcon from '@mui/icons-material/Chat';

/**
 * @name Comment
 * @description A comment component is an individual component used in the list of comments in the comments prompt
 * @param {username, comment}
 * @returns A Comment Component
 */
const Comment = ({username, comment}) => {
    return (
        <ListItem>
            <ListItemText 
                primary={username}
                secondary={comment}
            />
        </ListItem>
    );
}


/**
 * @name SocialsCommentsPrompt
 * @description This component is rendered to the user as a prompt when the user clicks to view the comments
 * @param {prompt title, list of comments, boolean whether or not to display, function to change display}
 * @returns A SocialsCommentsPrompt
 */
export const SocialsComments = ({title, comments, displayed, setDisplayed}) => {

    return (
        <Dialog open={displayed} >
            <DialogTitle>
                {`${title}`}
            </DialogTitle>
            
            <DialogContent>
                {comments.length === 0 ?
                    <Typography variant="h6" align={'center'} sx={{color: '#717171', fontWeight: 'bold', fontStyle: 'italic'}}>
                        No one has left a comment yet! 
                    </Typography>
                    :
                    <List>
                        {comments.map((comment) => (
                            <React.Fragment>
                                <Divider light />
                                <Comment username={comment.Username} comment={comment.Comment} />
                            </React.Fragment>
                        ))}
                    </List>
                }
                <Button 
                    align={'center'}
                    variant="container" 
                    sx={{backgroundColor: '#2196f3', color: '#ffffff'}}
                     onClick={() => {
                        setDisplayed(false);    
                    }}>
                    Back to searching!
                </Button>
            </DialogContent>

        </Dialog>
    );
}

/**
 * @name SocialsComments
 * @description The socials comments renders the comments, icons and functionality of the socials component
 * @param {title, comments}
 * @returns A SocialsComments Component
 */
export const SocialsCommentsIcon = ({onClick}) => {
    return (
        <Grid container item xs={6} rowSpacing={1} columnSpacing={1} onClick={onClick}>
            <DesignerRowSeparator />
            <Grid item xs={3}>
                <Typography variant="h6" align={'right'} sx={{color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic'}}>
                    <ChatIcon sx={{color: '#2196f3'}} />                            
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h6" align={'left'} sx={{color: '#2196f3', fontWeight: 'bold', fontStyle: 'italic'}}>
                    {'Comments'}
                </Typography>
            </Grid>
        </Grid>
    );
}