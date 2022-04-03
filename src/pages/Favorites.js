import {ApplicationContext} from "../store/application-context";
import {useContext} from "react";
import {MeetupList} from "../components/meetups/MeetupList";

export const Favorites = (props) => {
    const appCtx = useContext(ApplicationContext);

    let content;

    if (appCtx.count === 0) {
        content = <p>You have no favorites</p>
    } else {
        content = <MeetupList meetups={appCtx.favorites} />
    }

    return (
        <section>
            <h1>Favorites</h1>
            {content}
        </section>
    );
}