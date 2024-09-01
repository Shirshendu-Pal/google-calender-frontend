import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import store from "./redux-setup/store";

import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  <Provider store={store}>
  <React.StrictMode>
     <BrowserRouter >
     <GoogleOAuthProvider clientId="1072413459422-tqm091ppa89alq6n6iin3vul7700uuva.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
  </Provider>
);

