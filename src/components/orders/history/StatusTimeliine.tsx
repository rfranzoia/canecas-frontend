import { useEffect, useState } from "react";
import classes from "./StatusTimeline.module.css";
import { StatusTimelineItem } from "./StatusTimelineItem";

export const Timeline = (props) => {
    const [timelineData, setTimelineData] = useState([]);

    useEffect(() => {
        setTimelineData(props.timelineData)
    }, [props]);

    return timelineData.length > 0 && (
        <div className={classes.timelineContainer}>
            {timelineData.map((data, idx) => (
                <StatusTimelineItem data={data} key={idx}/>
            ))}
        </div>
    );
}
