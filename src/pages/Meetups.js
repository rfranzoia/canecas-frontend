import {useEffect, useState} from "react";
import {MeetupList} from "../components/meetups/MeetupList";
import {meetupApi} from "../api/MeetupAPI";

export const Meetups = (props) => {

    const [meetups, setMeetups] = useState([]);
    const [isLoading, setLoading] = useState(false)

    useEffect( () => {
        setLoading(true);
        meetupApi.list()
            .then(data => {
                setMeetups(data);
                setLoading(false);
            });
    }, [])

    let content;
    if (isLoading) {
        content = <p>Loading meetups ...</p>
    } else {
        content = <MeetupList meetups={meetups} />
    }

    return (
        <section>
            <h1>All meetups</h1>
            {content}
        </section>
    );
}
