import {Badge, ListGroup} from "react-bootstrap";
import {getCurrentOrderStatus, OrderStatus} from "../Orders";
import {DefaultCard} from "../../ui/DefaultCard";

export const StatusChangeList = (props) => {
    return (
        <div style={{padding: "1rem", display: "flex", justifyContent: "center"}}>
            <DefaultCard title="Status Changes" style={{width: "30rem", display: "flex", justifyContent: "center"}}>
                <ListGroup as="ol" numbered>
                    {props.statusHistory.map(history => {
                        return (
                            <ListGroup.Item key={history._id} as="li"
                                            className="d-flex justify-content-between align-items-start">
                                <div className="ms-2 me-auto">
                                    <div className="fw-bold">
                                        <Badge bg="primary">
                                            {history.changeDate.split("T")[0]} {history.changeDate.split("T")[1].substring(0, 8)}
                                        </Badge>
                                    </div>
                                    from: {OrderStatus[getCurrentOrderStatus(history.prevStatus)].value}
                                    to: {OrderStatus[getCurrentOrderStatus(history.currStatus)].value}
                                    <br/>
                                    {history.reason}
                                </div>
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
            </DefaultCard>
        </div>
    );
}