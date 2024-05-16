import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN} // Set your Auth0 domain from environment variables
    clientId={process.env.REACT_APP_AUTH0_CLIENT_ID} // Set your Auth0 client ID from environment variables
    authorizationParams={{
      redirect_uri: window.location.origin // Set the redirect URI to the current window location
    }}
  >
    {/* Render your main App component */}
    <App />
  </Auth0Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
