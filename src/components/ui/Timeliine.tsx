import {useEffect, useState} from "react";
import {TimelineItem} from "./TimelineItem";
import classes from "./Timeline.module.css";

export const Timeline = (props) => {
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        setTimelineData(props.timelineData)
    }, [props]);

    return timelineData.length > 0 && (
        <div className={classes.timelineContainer}>
            {timelineData.map((data, idx) => (
                <TimelineItem data={data} key={idx} />
            ))}
        </div>
    );
}
