import classes from "../css/MeetupItem.module.css"
import {Card} from "../ui/Card";
import {useContext} from "react";
import {ApplicationContext} from "../../store/application-context";

export const MeetupItem = (props) => {
    const appCtx = useContext(ApplicationContext);
    const isFavorite = appCtx.isFavorite(props.id);

    const handleToggleFavorite = () => {
        if (isFavorite) {
            appCtx.removeFavorite(props.id);
        } else {
            const meetup = {
                id: props.id,
                title: props.title,
                image: props.image,
                address: props.address,
                description: props.description
            }
            appCtx.addFavorite(meetup);
        }
    }

    return (
        <Card>
            <li className={classes.item}>
                <div>
                    <img className={classes.image} src={props.image} alt={props.title}/>
                </div>
                <div className={classes.content}>
                    <h3>{props.title}</h3>
                    <address>{props.address}</address>
                    <p>{props.description}</p>
                </div>
                <div className={classes.actions}>
                    <button onClick={handleToggleFavorite}>{isFavorite?"Remove favorite":"To favorites"}</button>
                </div>
            </li>
        </Card>
    )
}