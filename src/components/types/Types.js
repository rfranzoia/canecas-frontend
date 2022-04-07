import {useEffect, useState} from "react";
import {Card, Col, Container, Modal, Row, Toast} from "react-bootstrap";
import {typesApi} from "../../api/TypesAPI";
import {TypesList} from "./TypesList";
import {EditType} from "./EditType";
import {Button} from "../ui/Button";

export const Types = () => {
    const [types, setTypes] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editViewOp, setEditViewOp] = useState({
        typeId: "",
        op: ""
    });

    const TOAST_TIMEOUT = 3 * 1000;

    useEffect(() => {
        typesApi.list()
            .then(data => {
                setTypes(data);
            });
    }, [showEditModal])

    const handleNewType = () => {
        handleShowEditModal("new")
    }

    const handleShowToast = (show, message = "") => {
        if (show) {
            setToastMessage(message);
            typesApi.list()
                .then(data => {
                    setTypes(data);
                    setShowToast(show);
                });
        }
    }

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleShowEditModal = (op, id) => {
        setEditViewOp({
            typeId: id,
            op: op
        })
        setShowEditModal(true);
    }

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    }

    return (
        <Container fluid style={{padding: "0.5rem", display: "flex", justifyContent: "center"}}>
            <Row>
                <Col md="auto">
                    <Card border="dark" className="align-content-center" style={{width: '70rem'}}>
                        <Card.Header as="h3">Types</Card.Header>
                        <Card.Body>
                            <Card.Title>
                                <Button caption="New type" onClick={() => handleNewType("new")} type="new"/>
                            </Card.Title>
                            <TypesList types={types} onDelete={handleShowToast} onEdit={handleShowEditModal}/>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Toast show={showToast} onClose={handleCloseToast} delay={TOAST_TIMEOUT} autohide>
                        <Toast.Header>
                            <img src="holder.js/20x20?text=%20" className="rounded me-2" alt=""/>
                            <strong className="me-auto">Types</strong>
                            <small>just now</small>
                        </Toast.Header>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                </Col>
            </Row>
            <Row>
                <Modal show={showEditModal} onHide={handleCloseEditModal} backdrop="static" keyboard={true} size="lg"
                       centered className="align-content-center">
                    <Modal.Body>
                        <EditType id={editViewOp.typeId} op={editViewOp.op} onSaveCancel={handleCloseEditModal}/>
                    </Modal.Body>
                </Modal>
            </Row>
        </Container>
    );
}