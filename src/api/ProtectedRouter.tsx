import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { RootState } from "../store";

export const ProtectedRoute = ({component: Component, ...rest}) => {
    const isLoggedIn = useSelector<RootState, Boolean>(state => state.auth.isLoggedIn);
    return (<Route
        {...rest}
        render={props => {
            if (isLoggedIn) {
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

// if (appCtx.isLoggedIn()) {