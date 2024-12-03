import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import store from './redux/store';
import { Provider } from 'react-redux';
// import ErrorBoundary from './ErrorBoundary';
import * as serviceWorkerRegistration from './ServiceWorkerRegistration' // Import this for PWA setup


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
// serviceWorkerRegistration.register();

