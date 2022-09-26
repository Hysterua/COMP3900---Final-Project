import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';

import {MySpacesLogo} from '../myspaces-logo/myspaces-logo';
import {ProfileIcon} from './profile-icon/profile-icon';
import {HeaderLinks} from './header-link';

/**
 * @name HeaderBar
 * @description A React component that dictates the UI and behaviour of the MySpaces header bar component
 * @returns A Headerbar Component
 */
export const HeaderBar = () => {
  return (
    <div className='header-bar'>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <MySpacesLogo />
            <HeaderLinks />
            <ProfileIcon />
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </div>
  );
};