import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import {ApplicationContextProvider} from "./context/ApplicationContext";

ReactDOM.render(
    <ApplicationContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApplicationContextProvider>, document.getElementById('root'));
