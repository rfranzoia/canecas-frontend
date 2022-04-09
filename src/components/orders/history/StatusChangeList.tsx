import {DefaultCard} from "../../ui/DefaultCard";
import {Timeline} from "../../ui/Timeliine";
import {CustomButton} from "../../ui/CustomButton";

export const StatusChangeList = (props) => {
    return (
        <div style={{padding: "1rem", display: "flex", justifyContent: "center"}}>
            <DefaultCard title="Status Changes" style={{width: "50rem", display: "flex", justifyContent: "center"}}>
                <Timeline timelineData={props.statusHistory}/>
                <hr/>
                <div style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                    <CustomButton caption="close" onClick={props.onClick} type="close"/>
                </div>
            </DefaultCard>
        </div>
    );
}