import Cookie from 'js-cookie';

/**
 * @name setCookie
 * @description Given a cookiename and a piece of data, this function can initialise a cookie in the browser for platform applications
 * @param {string} cookiename 
 * @param {*} cookiedata 
 * @returns void
 */
export const setCookie = (cookiename, cookiedata) => {
    Cookie.set(cookiename, cookiedata, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
        path: "/"
    });
}

/**
 * @name getCookie
 * @description Given the cookiename, this function pretrieves the data lodged as a cookie under the cookiename
 * @param {string} cookiename 
 * @returns The cookiename lodged in the browser
 */
export const getCookie = (cookiename) => {
    return Cookie.get(cookiename);
}

/**
 * @name removeCookie
 * @description Given the cookiename, removes it's existence from the browser
 * @param {string} cookiename 
 * @returns The original cookiedata lodged under the cookiename
 */
export const removeCookie = (cookiename) => {
    return Cookie.remove(cookiename);
}

/**
 * @name checkCookie
 * @description Given a cookiename, check's the existence of a cookie in the browser
 * @param {string} cookiename 
 * @returns boolean.  True for it's existence and false if otherwise
 */
export const checkCookie = (cookiename) => {
    return getCookie(cookiename) ? true : false;
}

/**
 * @name fetchAuthorisedUserID
 * @description fetches a very specific cookiename used for user authentication on the platform
 * @returns The userID if it is valid.  Otherwise, returns null.
 */
export const fetchAuthorisedUserID = () => {
    const userID = getCookie('MySpacesActiveSessionUserID');
    return userID ? userID : null;
}

