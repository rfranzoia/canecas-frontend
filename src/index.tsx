import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto'
import App from './App';
import { ApplicationContextProvider } from './context/ApplicationContext';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <ApplicationContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApplicationContextProvider>,
  document.getElementById('root')
);

