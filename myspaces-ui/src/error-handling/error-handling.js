

/**
 * @name mapErrorPromptMessage
 * @function
 * @description Function that maps a given error code into a user friendly error prompt string
 * @param {interger error code} errorcode 
 * @returns string representing user friendly error prompt
 */
export const mapErrorPromptMessage = (errorcode) => {

    if (errorcode === ErrorHandler.CODE_SUCCESS){return ErrorHandler.CODE_SUCCESS_DESC;}
    if (errorcode === ErrorHandler.CODE_CAUGHT_API){return ErrorHandler.CODE_CAUGHT_API_DESC;}
    
    if (errorcode === ErrorHandler.CODE_FAILURE){return ErrorHandler.CODE_FAILURE_DESC;}
    
    if (errorcode === ErrorHandler.CODE_INCORRECT_EMAIL_PASS){return ErrorHandler.CODE_INCORRECT_EMAIL_PASS_DESC;}
    
    if (errorcode === ErrorHandler.CODE_EMAIL_TAKEN){return ErrorHandler.CODE_EMAIL_TAKEN_DESC;}
    if (errorcode === ErrorHandler.CODE_USERNAME_TAKEN){return ErrorHandler.CODE_USERNAME_TAKEN_DESC;}
    if (errorcode === ErrorHandler.CODE_PHONE_TAKEN){return ErrorHandler.CODE_PHONE_TAKEN_DESC;}
    if (errorcode === ErrorHandler.CODE_ADDRESS_TAKEN){return ErrorHandler.CODE_ADDRESS_TAKEN_DESC;}
    
    if (errorcode === ErrorHandler.CODE_UNABLE_TO_GEOTAG){return ErrorHandler.CODE_UNABLE_TO_GEOTAG_DESC;}
    
    if (errorcode === ErrorHandler.CODE_LISTING_BOOKED_AT_THIS_TIME){return ErrorHandler.CODE_LISTING_BOOKED_AT_THIS_TIME_DESC;}
    
    if (errorcode === ErrorHandler.CODE_TAKEN || errorcode === ErrorHandler.CODE_TAKEN_UNIQUE){return ErrorHandler.CODE_TAKEN_DESC;}
    
    if (errorcode === ErrorHandler.CODE_NO_RESULTS){return ErrorHandler.CODE_NO_RESULTS_DESC;}
    if (errorcode === ErrorHandler.CODE_NO_MATCHING_ID){return ErrorHandler.CODE_NO_MATCHING_ID_DESC;}
    if (errorcode === ErrorHandler.CODE_NOTHING_TO_UPDATE){return ErrorHandler.CODE_NOTHING_TO_UPDATE_DESC;}
    
    if (errorcode === ErrorHandler.CODE_CHECK_VIOLATION){return ErrorHandler.CODE_CHECK_VIOLATION_DESC;}
    if (errorcode === ErrorHandler.CODE_UNABLE_TO_GEOTAG_SEARCH){return ErrorHandler.CODE_UNABLE_TO_GEOTAG_SEARCH_DESC;}

    return null;
    
}

/**
 * @name ErrorHandler
 * @class
 * @description Object to track all the possible error codes received from the backend and provide user friendly error messages
 */
export const ErrorHandler = {

    CODE_SUCCESS: 0,
    CODE_SUCCESS_DESC: "Operation Successful",
    
    CODE_FAILURE: 1,
    CODE_FAILURE_DESC: "An Unresolved Error Occured",
    
    CODE_INCORRECT_EMAIL_PASS: 5,
    CODE_INCORRECT_EMAIL_PASS_DESC: "Email or Password is incorrect",
    
    CODE_EMAIL_TAKEN: 10,
    CODE_EMAIL_TAKEN_DESC: "This email is already being used!",
    
    CODE_USERNAME_TAKEN: 11,
    CODE_USERNAME_TAKEN_DESC: "This username is already taken!",
    
    CODE_PHONE_TAKEN: 12,
    CODE_PHONE_TAKEN_DESC:  "This phone number is already being used!",
    
    CODE_ADDRESS_TAKEN: 15,
    CODE_ADDRESS_TAKEN_DESC: "This address has already been listed!",
    
    CODE_UNABLE_TO_GEOTAG: 16,
    CODE_UNABLE_TO_GEOTAG_DESC: "We could not pin the location of this address!",
    
    CODE_LISTING_BOOKED_AT_THIS_TIME: 20,
    CODE_LISTING_BOOKED_AT_THIS_TIME_DESC: "This listing is already booked during this time frame!",
    
    CODE_TAKEN: 30,
    CODE_TAKEN_UNIQUE: 50,
    CODE_TAKEN_DESC:  "Passed Identification Number is already in use!",
    
    CODE_NO_RESULTS: 31,
    CODE_NO_RESULTS_DESC:  "Could not find any results!",
    
    CODE_NO_MATCHING_ID: 32,
    CODE_NO_MATCHING_ID_DESC: "Could not find any results!",

    
    CODE_NOTHING_TO_UPDATE: 33,
    CODE_NOTHING_TO_UPDATE_DESC: "No change in records!",

    CODE_CHECK_VIOLATION: 99,
    CODE_CHECK_VIOLATION_DESC: "Database parameters violated",

    CODE_UNABLE_TO_GEOTAG_SEARCH: 40,
    CODE_UNABLE_TO_GEOTAG_SEARCH_DESC: "We couldn't find this suburb!",

    CODE_CAUGHT_API: 999,
    CODE_CAUGHT_API_DESC: 'Server is not responding.  Please wait!'
    
}