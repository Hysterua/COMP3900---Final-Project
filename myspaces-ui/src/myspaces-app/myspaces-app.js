import './myspaces-app.css';

import React from 'react'
import { Routes, Route, Navigate, Outlet} from "react-router"

import {checkCookie} from "../authentication/user-cookie-management";

import{HeaderBar} from '../components/header-bar/header-bar';

import {AdminPage} from '../pages/admin-pages/admin-page';

import {MyAccountPage} from '../pages/account-management/my-account-page';
import {SpaceBookingPage} from '../pages/booking-procedure/space-booking-page';
import {EditMyListingPage} from '../pages/account-management/edit-listing-page';
import {SpaceRegistrationPage} from "../pages/account-management/space-registration-page"
import {ViewMyBookingsPage} from '../pages/account-management/view-bookings-page';
import {ViewMyListingsPage} from '../pages/account-management/view-listings-page';

import {LandingPage} from "../pages/landing-page";
import {SpaceSearchPage} from '../pages/booking-procedure/space-search-page';

import {CreateAccountPage} from "../pages/account-management/create-account";
import {LoginPage} from "../pages/account-management/login-page";

/**
 * @name AdminAuthorisedRoutes
 * @description Protects any nested route in this component to admin only
 * @returns Route that was prompted by the user or the landing page depenidng on authorisation
 */
const AdminAuthorisedRoutes = () => {
  return checkCookie('IsAdmin') ? <Outlet /> : <Navigate to="/"/>;
}

/**
 * @name UserAuthorisedRoutes
 * @description Protects any nested route in this component to user logged in only
 * @returns Route that was prompted by the user or the login page depending on authorisation
 */
const UserAuthorisedRoutes = () => {
  return checkCookie('MySpacesActiveSessionUserID') ? <Outlet /> : <Navigate to="/Log%20In"/>;
}

/**
 * @name GuestAuthorisedRoutes
 * @description Protects any nested route in this component to guest user only
 * @returns Route that was prompted by the user or the landing page depending on authorisation
 */
const GuestAuthorisedRoutes = () => {
  return !checkCookie('MySpacesActiveSessionUserID') ? <Outlet /> : <Navigate to="/"/>;
}

/**
 * @name GeneralRoutes
 * @description Wrapper for any route that does not require any protection from user authorisation whatsoever
 * @returns Route that was prompted by the user
 */
const GeneralRoutes = () => {
  return <Outlet />
}

/**
 * @name MySpacesAppRoutes
 * @description This component controls all the routing between pages on the platform.
 * @returns Nested Routing Component
 */
const MySpacesAppRoutes = () => {

  return (
    <Routes>

      <Route element={<UserAuthorisedRoutes />} >
        <Route path="/My%20Account" element={<MyAccountPage/>} />
        <Route path ="/List%20A%20Space" element={<SpaceRegistrationPage/>} />
        <Route path="/View%20My%20Listings" element={<ViewMyListingsPage/>}/>
        <Route path="/View%20My%20Bookings" element={<ViewMyBookingsPage />} />
        <Route path="/Edit%20My%20Listing" element={<EditMyListingPage />} />
        <Route path="/Space%20Booking%20Page" element={<SpaceBookingPage />} />
      </Route>
      
      <Route element={<GuestAuthorisedRoutes />}>
        <Route path="/Log%20In" element={<LoginPage/>}/>
        <Route path="/Create%20Acount" element={<CreateAccountPage/>}/>
      </Route>
      
      <Route element={<GeneralRoutes />}>
        <Route path="/" element={<LandingPage/>}/>
        <Route path='Space%20Search%20Page' element={<SpaceSearchPage />}/>
      </Route>

      <Route element={<AdminAuthorisedRoutes />}>
        <Route path="/Admin" element={<AdminPage/>}/>
      </Route>
      
    </Routes>
  );
}

/**
 * @name MySpacesApp
 * @description Main Application Component for the MySpacesPlatform
 * @returns React Component
 */
export const MySpacesApp = () => {
  
  return (
    <div className="myspaces-app">
      <HeaderBar/>
      <MySpacesAppRoutes />
    </div>
  );
}