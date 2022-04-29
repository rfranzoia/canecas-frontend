import {Presentation} from "../presentation/Presentation";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {User} from "../../domain/User";

export const Home = () => {
    const isLoggedIn = useSelector<RootState, Boolean>(state => state.auth.isLoggedIn);
    const user = useSelector<RootState, User>(state => state.auth.user);
    return (
        <>
            <div className="container4">
                {isLoggedIn &&
                    (
                        <p style={{textAlign: "center"}}>Welcome Back {user.name}</p>
                    )}
            </div>
            <div>
                <Presentation />
            </div>

        </>
    );
}