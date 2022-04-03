import {Card} from "../ui/Card";
import classes from "../css/NewMeetupForm.module.css";
import {useRef} from "react";

export const NewMeetupForm = (props) => {
    const titleRef = useRef();
    const imageRef = useRef();
    const addressRef = useRef();
    const descriptionRef = useRef();

    const handleAddMeetup = (event) => {
        event.preventDefault();

        const title = titleRef.current.value;
        const image = imageRef.current.value;
        const address = addressRef.current.value;
        const description = descriptionRef.current.value;

        const meetup = {
            id: Date.now(),
            title: title,
            image: image,
            address: address,
            description: description,
        }

        props.onNewMeetup(meetup);

    }
    return (
        <Card>
            <form className={classes.form} onSubmit={handleAddMeetup}>
                <div className={classes.control}>
                    <label htmlFor="title">Title</label>
                    <input id="title" required type="text" ref={titleRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor="image">Image</label>
                    <input id="image" required type="url" ref={imageRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor="address">Address</label>
                    <input id="address" required type="text" ref={addressRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor="description">Description</label>
                    <textarea id="title" required rows="5" ref={descriptionRef}/>
                </div>
                <div className={classes.actions}>
                    <button>Add Meetup</button>
                </div>
            </form>
        </Card>
    );
}