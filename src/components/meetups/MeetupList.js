import classes from "../css/MeetupList.module.css";
import {MeetupItem} from "./MeetupItem";

export const MeetupList = (props) => {
    return (
        <ul className={classes.list}>
            {props.meetups.length > 0 && props.meetups.map(meetup => (
                <MeetupItem
                    key={meetup.id}
                    id={meetup.id}
                    title={meetup.title}
                    image={meetup.image}
                    address={meetup.address}
                    description={meetup.description}
                />
            ))}
        </ul>
    )
}