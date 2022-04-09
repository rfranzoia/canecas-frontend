import {useContext} from "react";
import { ApplicationContext } from "../../context/ApplicationContext";

export const Home = () => {
    const appCtx = useContext(ApplicationContext);
    const isLoggedIn = appCtx.isLoggedIn();

    return (
        <div className="container4">
            {isLoggedIn && (<p>Welcome Back </p>)}
            <h1>Home</h1>
        </div>
    );
}