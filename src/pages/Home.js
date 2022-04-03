import {useContext} from "react";
import {ApplicationContext} from "../store/application-context";

export const Home = (props) => {
    const appCtx = useContext(ApplicationContext);
    const isLoggedIn = appCtx.isLoggedIn();

    return (
        <div>
            {isLoggedIn && (<p>Welcome Back </p>)}
            <h1>Home</h1>
        </div>
    );
}