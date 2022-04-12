import {DefaultCard} from "../../ui/DefaultCard";
import {Timeline} from "./StatusTimeliine";
import {CustomButton} from "../../ui/CustomButton";

export const StatusChangeList = (props) => {
    return (
        <div style={{padding: "1rem", display: "flex", justifyContent: "center"}}>
            <DefaultCard title="Atualizações de Status" style={{width: "50rem", display: "flex", justifyContent: "center"}}>
                <Timeline timelineData={props.statusHistory}/>
                <hr/>
                <div style={{display: "flex", justifyContent: "center", padding: "0.5rem"}}>
                    <CustomButton caption="Fechar" onClick={props.onClick} type="close"/>
                </div>
            </DefaultCard>
        </div>
    );
}