import React from 'react';
import ReactDOM from 'react-dom/client';
import {MySpacesApp} from './myspaces-app/myspaces-app';
import {BrowserRouter} from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MySpacesApp />
    </BrowserRouter>
  </React.StrictMode>
);



