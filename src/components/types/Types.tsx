import { useEffect, useState } from "react";
import { Alert, Card, Modal } from "react-bootstrap";
import { typesApi } from "../../api/TypesAPI";
import { TypesList } from "./TypesList";
import { EditType } from "./EditType";
import { CustomButton } from "../ui/CustomButton";

export const Types = () => {
    const [types, setTypes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        typeId: "",
        op: "",
    });
    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: "",
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message,
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
        }, 3000)}
    };

    const handleDelete = () => {
        typesApi.list().then((data) => {
            setTypes(data);
        });
        handleAlert(true, "danger", "Delete Type", "Type has been deleted successfuly")
    }

    useEffect(() => {
        typesApi.list().then((data) => {
            setTypes(data);
        });
    }, [showEditModal]);

    const handleShowEditModal = (op: string, id?: string) => {
        setEditViewOp({
            typeId: id,
            op: op,
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    return (
        <div className="container4">
            {alert.show && (
                <div>
                    <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible transition  className="alert-top">
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            )}
            <div>
                <Card border="dark" className="align-content-center">
                    <Card.Header as="h3">Types</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <CustomButton
                                caption="New Type"
                                type="new"
                                customClass="fa fa-industry"
                                onClick={() => handleShowEditModal("new")} />
                        </Card.Title>
                        <TypesList 
                            types={types} 
                            onDelete={handleDelete} 
                            onEdit={handleShowEditModal}/>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <Modal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    backdrop="static"
                    centered
                    style={{ justifyItems: "center", margin: "auto"}}
                    size="lg"
                    keyboard={true}>
                    <Modal.Body>
                        <div className="container4">
                            <EditType id={editViewOp.typeId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};
