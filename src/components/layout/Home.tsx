import {useContext} from "react";
import { ApplicationContext } from "../../context/ApplicationContext";

export const Home = () => {
    const appCtx = useContext(ApplicationContext);

    return (
        <div className="container4">
            {appCtx.isLoggedIn() &&
                (
                    <p style={{textAlign: "center"}}>Welcome Back </p>
                )}
            <h1>Home</h1>
        </div>
    );
}