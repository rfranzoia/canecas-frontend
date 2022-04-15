import {useContext, useEffect} from "react";
import {ApplicationContext} from "../../context/ApplicationContext";
import {Presentation} from "../presentation/Presentation";

export const Home = () => {
    const appCtx = useContext(ApplicationContext);

    useEffect(() => {
        appCtx.checkValidLogin()
            .then(() => undefined);
    }, [])

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