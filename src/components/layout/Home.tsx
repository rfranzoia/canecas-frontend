import {useContext} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {Presentation} from "../presentation/Presentation";

export const Home = () => {
    const appCtx = useContext(ApplicationContext);

    return (
        <>
            <div className="container4">
                {appCtx.isLoggedIn() &&
                    (
                        <p style={{textAlign: "center"}}>Welcome Back {appCtx.userData.userEmail}</p>
                    )}
            </div>
            <div>
                <Presentation />
            </div>
        </>
    );
}