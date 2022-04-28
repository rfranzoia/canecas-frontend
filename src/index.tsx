import {createRoot} from "react-dom/client";
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {ApplicationContextProvider} from './context/ApplicationContext';
import './index.css';

const root = createRoot(document.getElementById("root"));
root.render(
    <ApplicationContextProvider>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </ApplicationContextProvider>
);

