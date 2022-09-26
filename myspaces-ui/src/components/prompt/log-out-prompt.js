import React from 'react';
import { removeCookie } from '../../authentication/user-cookie-management';
import {Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import { useNavigate } from 'react-router';

/**
 * @name LogOutPrompt
 * @description This component initiates the log out dialog prompt to the user before fully logging out the user
 * @param {displayed boolean, set displayed boolean function}
 * @returns A LogOutPrompt Component
 */
export const LogOutPrompt = ({displayed, setDisplayed}) => {

    let navigate = useNavigate();

    return (
        <Dialog open={displayed}>
            <DialogTitle>
                Are you sure you want to log out?
            </DialogTitle>
            <DialogContent>
                <Button 
                    variant="container" 
                    sx={{backgroundColor: 'red'}} 
                    onClick={() => {
                        setDisplayed(false);   
                        removeCookie('MySpacesActiveSessionUserID');
                        removeCookie('IsAdmin');
                        navigate("/");  
                        document.location.reload();
                    }}>
                    YES
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