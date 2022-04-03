import {Redirect, Route} from "react-router-dom";
import {useContext} from "react";
import {ApplicationContext} from "../context/ApplicationContext";

export const ProtectedRoute = ({component: Component, ...rest}) => {
    const appCtx = useContext(ApplicationContext);
    return (<Route
        {...rest}
        render={props => {
            if (appCtx.isLoggedIn()) {
                return <Component {...props} />;
            } else {
                return (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: {
                                from: props.location
                            }
                        }}
                    />);
            }
        }}
    />);
};