import { ErrorHandler, mapErrorPromptMessage } from '../error-handling/error-handling';

/**
 * @name emptyFunction
 * @description This function acts as a defaulted function stub for any passed down function that has no content
 */
const emptyFunction = () => {}

/**
 * @name mySpacesAPIGET
 * @description This API function acts as an interface for all GET calls
 * @param {string} route 
 * @param {function to set the error code} setError 
 * @param {function to set the response and payload} setResponse 
 * @param {function to set the querying boolean} setQuerying 
 * @returns Void
 */
export const mySpacesAPIGET = (route, setError, setResponse, setQuerying) => {
    mySpacesAPI({route, apiMethod: "GET", setError: setError, setResponse: setResponse, setQuerying: setQuerying})
    return
}

/**
 * @name mySpacesAPIPOST
 * @description This API function acts as an interface for all POST calls
 * @param {string} route 
 * @param {an input object that gets passed down to the server} input 
 * @param {function to set the error code} setError 
 * @param {function to set the response and payload} setResponse 
 * @param {an event handler function that will be called after successful API execution} _callback 
 * @returns Void
 */
export const mySpacesAPIPOST = (route, input, setError, setResponse = () => {}, _callback = () => {})  => {
    mySpacesAPI({route: route, apiMethod: "POST", input: input, setError: setError, setResponse: setResponse, _callback: _callback})
    return 
}

/**
 * @name mySpacesAPIPUT
 * @description This API function acts as an interface for all PUT calls
 * @param {string} route 
 * @param {an input object that gets passed down to the server} input 
 * @param {function to set the error code} setError 
 * @param {an event handler function that will be called after successful API execution} _callback 
 * @returns Void
 */
export const mySpacesAPIPUT = (route, input, setError, _callback = () => {}) => {  
    mySpacesAPI({route: route, apiMethod: "PUT", input: input, setError: setError})
    _callback();
    return
}

/**
 * @name mySpacesAPIDELETE
 * @description This API function acts as an interface for all DELETE calls
 * @param {string} route 
 * @param {an event handler function that will be called after successful API execution} _callback 
 * @returns Void
 */
export const mySpacesAPIDELETE = (route, _callback = () => {}) => {  
    mySpacesAPI({route: route, apiMethod: "DELETE", _callback: _callback});
    return;
}

/**
 * @name mySpacesAPI
 * @description This API fetch function manages any type of API call we need.
 - Decides the route and server
 - Sets the error code, regardless of success and failure
 - Sets response.payload prop
 - If there is a callback function, the callback is called after executing the function if it returned a successful error code
 * @returns Void
 */
const mySpacesAPI = ({route, apiMethod, input, setError = emptyFunction, setResponse = emptyFunction, setQuerying = emptyFunction, _callback = emptyFunction} = {}) => {
    
    const fetchRoute = `http://127.0.0.1:8000${route}`;
    
    const fetchBody = (apiMethod === "PUT" || apiMethod === "POST") ? 
    {                
        method: apiMethod,
        headers: { 
            "Content-Type": "application/json"
        },
        body: input
    }
    :
    {            
        method: apiMethod,
        headers: { 
            "Content-Type": "application/json"
        }
    }
    
    fetch(fetchRoute, fetchBody)
    
    .then(response => {
        return response.json()
    })
    
    .then(data => { 
        const errorcode = data.ErrorCode;
        if (errorcode !== ErrorHandler.CODE_SUCCESS){
            setQuerying(false);
            setError(mapErrorPromptMessage(errorcode));
            setResponse({
                payload: null
            })
            return;
        }

        setResponse({
            payload: data.Payload 
        });
        
        setQuerying(false);
        _callback();
    })
    
    .catch((error) => {
        setError(mapErrorPromptMessage(ErrorHandler.CODE_CAUGHT_API));
        console.error(`ERROR: Could not fetch results from server -> ${error}`);
        setResponse({
            payload: null
        })
        setQuerying(false); 
    });
    
}