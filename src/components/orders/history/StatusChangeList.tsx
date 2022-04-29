import { CustomButton } from "../../ui/CustomButton";
import { DefaultCard } from "../../ui/DefaultCard";
import { Timeline } from "./StatusTimeliine";

export const StatusChangeList = (props) => {
    return (
        <>
            <DefaultCard title="Status Changes">
                <Timeline timelineData={props.statusHistory}/>
            </DefaultCard>
            <div className={"actions action-justify-center"}>
                <CustomButton caption="close" onClick={props.onClick} type="close"/>
            </div>
        </>
    );
}