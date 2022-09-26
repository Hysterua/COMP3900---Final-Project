import React, { useState, useEffect} from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import {ErrorAlert} from '../../components/error-alert/error-alert';
import { removeCookie, setCookie} from "../../authentication/user-cookie-management";
import { mySpacesAPIPOST } from "../../my-spaces-api/call-my-spaces-api";

/**
 * @name LoginPage
 * @descripton Designs the UI and Functionality of the LoginPage
 - A user can log into their account
 - If a User inputs the incorrect email or password, they are displayed an error
 * @returns 
 */
export const LoginPage = () => {

    const [email, setEmail] = useState(String);
    const [password, setPassword] = useState(String);
    
    const [error, setError] = useState('');
    const [response, setResponse] = useState({
        payload: null
    });
  
    let navigate = useNavigate();
    
    
    const handleLogin = () => {

        if (!email || !password){
            setError('Make sure you have filled out both username and password please!');
            return;
        }
        
        const userAuthenticateCallBack = () => {
            if (!response.payload){return;}
            const userID = response.payload.UserID;
            const isAdmin = response.payload.IsAdmin;
            removeCookie('MySpacesActiveSessionUserID');
            removeCookie('IsAdmin');
            setCookie('MySpacesActiveSessionUserID', userID);
            if (isAdmin) {setCookie('IsAdmin', true);}
            navigate('/');
            document.location.reload(); 
        }

        mySpacesAPIPOST('/user/authenticate', JSON.stringify({
            Email: email,
            Password: password
        })
        , setError, setResponse, userAuthenticateCallBack);

    };
    

    return (
        <Container maxWidth="xs">
            <Box
                component="form"
                sx={{
                    "& .MuiTextField-root": { m: 1.5 },
                    p: 2
                }}
                noValidate
                autoComplete="off"
            >
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            align="center"
                        >
                            Sign in to MySpaces
                        </Typography>
                    </Grid>
                    
                    {!error ? (null) : 
                        <ErrorAlert severity="error" onClick={() => setError(null)}>
                            {error}
                        </ErrorAlert>
                    } 

                    <Grid item xs={12}>
                        <TextField
                            required
                            id="email"
                            label="email address"
                            fullWidth
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            type="password"
                            id="password"
                            label="password"
                            fullWidth
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter'){
                                    handleLogin();
                                }
                              }}
                        />
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Button 
                            variant="contained"
                            onClick={handleLogin}
                        >
                            Log In
                        </Button>
                    </Grid>

                    <Grid item xs={6} style={{ textAlign: "center" }}>
                        <Button onClick={() => {setError("Too bad.")}}>
                            Forgot Password?
                        </Button>
                    </Grid>

                    <Grid item xs={6} style={{ textAlign: "center" }}>
                        <Button 
                            component={Link} to="/Create%20Acount"
                        >
                            Create an Account
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

