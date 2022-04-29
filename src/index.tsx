import {createRoot} from "react-dom/client";
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import {ApplicationContextProvider} from './context/ApplicationContext';
import { Provider } from "react-redux";
import store from "./store";
import './index.css';

const root = createRoot(document.getElementById("root"));
root.render(
    <ApplicationContextProvider>
        <Provider store={store}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </Provider>
    </ApplicationContextProvider>
);

