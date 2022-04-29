import { useSelector } from "react-redux";
import { User } from "../../domain/User";
import { RootState } from "../../store";
import { Presentation } from "../presentation/Presentation";

export const Home = () => {
    const isLoggedIn = useSelector<RootState, Boolean>(state => state.auth.isLoggedIn);
    const user = useSelector<RootState, User>(state => state.auth.user);
    return (
        <>
            <div className="container4">
                {isLoggedIn &&
                    (
                        <p style={{ textAlign: "center" }}>Welcome Back {user.name}</p>
                    )}
            </div>
            <div>
                <Presentation/>
            </div>

        </>
    );
}