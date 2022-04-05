import {useContext} from "react";
import {ApplicationContext} from "./context/ApplicationContext";
import {TypesShowCase} from "./components/types/TypesShowCase";

export const Home = () => {
    const appCtx = useContext(ApplicationContext);
    const isLoggedIn = appCtx.isLoggedIn();


    return (
        <div>
            {isLoggedIn && (<p>Welcome Back </p>)}
            <h1>Home</h1>
            <TypesShowCase />
        </div>
    );
}