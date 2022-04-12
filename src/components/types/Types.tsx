import {useContext, useEffect, useState} from "react";
import {Card, Modal} from "react-bootstrap";
import {typesApi} from "../../api/TypesAPI";
import {TypesList} from "./TypesList";
import {EditType} from "./EditType";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";

export const Types = () => {
    const appCtx = useContext(ApplicationContext);
    const [types, setTypes] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        typeId: "",
        op: "",
    });

    const handleDelete = () => {
        typesApi.list().then((data) => {
            setTypes(data);
        });
        appCtx.handleAlert(true, AlertType.WARNING, "Delete Type", "Type has been deleted successfully")
        setShowAlert(true);
    }

    useEffect(() => {
        typesApi.list().then((data) => {
            setTypes(data);
        });
    }, [showEditModal]);

    useEffect(() => {
        if (!appCtx.alert.show) {
            setShowAlert(false)
        }
    },[appCtx.alert.show])

    const handleShowEditModal = (op: string, id?: string) => {
        setEditViewOp({
            typeId: id,
            op: op,
        });
        setShowEditModal(true);
    };

    const handleCloseEditModal = (error?) => {
        setShowEditModal(false);
        if (error) {
            appCtx.handleAlert(true, AlertType.DANGER, error.name, error.description);
            setShowAlert(true);
        }
    };

    return (
        <div className="default-margin">
            {showAlert && <AlertToast/>}
            <Card border="dark" className="align-content-center">
                <Card.Header as="h3">Types</Card.Header>
                <Card.Body>
                    <Card.Title>
                        <CustomButton
                            caption="New Type"
                            type="new"
                            customClass="fa fa-industry"
                            onClick={() => handleShowEditModal("new")}/>
                    </Card.Title>
                    <TypesList
                        types={types}
                        onDelete={handleDelete}
                        onEdit={handleShowEditModal}/>
                </Card.Body>
            </Card>
            <div>
                <Modal
                    show={showEditModal}
                    onHide={handleCloseEditModal}
                    backdrop="static"
                    centered
                    style={{justifyItems: "center", margin: "auto"}}
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
