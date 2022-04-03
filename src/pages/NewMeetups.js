import {NewMeetupForm} from "../components/meetups/NewMeetupForm";
import {meetupApi} from "../api/MeetupAPI";
import {useHistory} from "react-router-dom";

export const NewMeetups = (props) => {
    const history = useHistory();
    const onNewMeetupHandler = (meetup) => {
        meetupApi.create(meetup);
        history.replace("/");
    }

    return (
        <section>
            <h1>Add New Meetup</h1>
            <NewMeetupForm onNewMeetup={onNewMeetupHandler}/>
        </section>
    );
}