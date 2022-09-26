import React, { useState } from "react"
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../components/error-alert/error-alert";
import { mySpacesAPIPOST } from "../../my-spaces-api/call-my-spaces-api";

import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

/**
 * @name CreateAccountPage
 * @description Designs the UI and Functionality of the create account page
 - If a user does not fill in every field, they are notified to fill in all details
 - If a user enters in an email, phone, or username field that is already being used, they are displayed an error.
 - If a user enters all information correctly, the account is created and they are redircted to login page.
 * @returns A CreateAccountPage Component
 */
export const CreateAccountPage = () => {

    const [firstName, setFirstName] = useState(String);
    const [lastName, setLastName] = useState(String);
    const [username, setUsername] = useState(String);
    const [usernameError, setUsernameError] = useState("");
    // const validateUserName = () => {
    //     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    //         setUsernameError("")
    //         return (true)
    //     } else {
    //         setUsernameError("This username is taken")
    //         return (false)
    //     }
    // }

    const [email, setEmail] = useState(String);
    const [emailError, setEmailError] = useState("");
    const validateEmail = () => {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            setEmailError("")
            return (true)
        } else {
            setEmailError("You have entered an invalid email address!")
            return (false)
        }
    }

    const [phoneNumber, setPhoneNumber] = useState(Number);
    const [password, setPassword] = useState(String);
    const [passwordConfirmation, setPasswordConfirmation] = useState(String);
    
    const [error, setError] = useState(null);
  
    let navigate = useNavigate();
    
    const callBackCreateUser = () => {
        navigate("/Log%20In")
    }

    const handleCreateUser = () => {
    
        if (!firstName || !lastName || !username || !email || !phoneNumber || !password || !passwordConfirmation){
            setError('Make sure you have filled out all your details please!');
            return;
        }

        if (password !== passwordConfirmation) {
            setError("Passwords don't match.")
            return;
        }
        
        mySpacesAPIPOST("/user", 
            JSON.stringify({
                Username: username,
                UserPassword: password,
                Email: email,
                FirstName: firstName,
                LastName: lastName,
                PhoneNo: phoneNumber,
                IsAdmin: false
            }),
        setError, callBackCreateUser)
      
    }
  
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
            
                {!error ? (null) : 
                    <ErrorAlert severity="error" onClick={() => setError(null)}>
                        {error}
                    </ErrorAlert>
                }   
                
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            gutterBottom
                            variant="h5"
                            component="div"
                            align="center"
                        >
                            Create MySpaces Account
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                            required 
                            id="first name" 
                            label="first name" 
                            fullWidth 
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField 
                            required 
                            id="last name" 
                            label="last name" 
                            fullWidth 
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField 
                            required 
                            id="username" 
                            label="username" 
                            fullWidth 
                            onChange={(e) => setUsername(e.target.value)}
                        />                    
                    </Grid>

                    <Grid item xs={12}>
                    <TextField
                        required
                        onChange={(e) => {setEmail(e.target.value)}}
                        id="email" 
                        label="email" 
                        fullWidth
                        onFocus={() => {setEmailError(null)}}
                        onBlur={validateEmail}
                        error={emailError!==""}
                        helperText={emailError}
                    />
                    </Grid>
                    
                    <Grid item xs={12}>
                     
                        <PhoneInput
                            required
                       
                            
                         

                            // inputStyle = {{
                            //     background: "grey"
                            // }}

                            id="phone-number" 
                            placeholder="phone number" 
                            value={""}
                            onChange={(value) => setPhoneNumber(value)}
                            maxLength={15}
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
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            required
                            type="password"
                            id="password-confirmation"
                            label="confirm password"
                            fullWidth
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Button 
                            variant="contained" 
                            onClick={handleCreateUser}
                        >
                            Create Account
                        </Button>
                    </Grid>

                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <Button
                            component={Link} to="/log%20In"
                        >
                            Already have an account?
                            <br />
                            Sign in
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};
