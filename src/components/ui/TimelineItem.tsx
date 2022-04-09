import { OrderStatus } from "../../domain/Order";
import classes from "./Timeline.module.css";

export const TimelineItem = ({ data }) => (
    <div className={classes.timelineItem}>
        <div className={classes.timelineItemContent}>
            <span className={classes.tag} style={{ background: '#e17b77' }}>
                {OrderStatus[data.prevStatus]}
            </span>
            <time>{data.changeDate.split("T")[0]} {data.changeDate.split("T")[1].substring(0, 8)}</time>
            <p>{data.reason}</p>
            <span className={classes.circle} />
        </div>
    </div>
);
