import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ApplicationContextProvider } from './context/ApplicationContext';
import './index.css';
import store from "./store";

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

