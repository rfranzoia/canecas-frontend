import {typesApi} from "../../api/TypesAPI";
import {EditTypeForm} from "./EditTypeForm";
import {useContext, useEffect, useState} from "react";
import {Card, Col, Container, Row} from "react-bootstrap";
import {ApplicationContext} from "../../context/ApplicationContext";
import {StatusCodes} from "http-status-codes";

export const EditType = (props) => {
    const appCtx = useContext(ApplicationContext);
    const [type, setType] = useState({
        description: "",
        image: "",
    });

    const handleSaveType = (type) => {
        const save = async (type) => {
            let result;
            if (props.op === "edit") {
                result = await typesApi.withToken(appCtx.userData.authToken).update(props.id, type)
            } else if (props.op === "new") {
                result = await typesApi.withToken(appCtx.userData.authToken).create(type);
            }
            if (result.statusCode) {
                if (result.statusCode === StatusCodes.UNAUTHORIZED) {
                    appCtx.showErrorAlert(result.name, result.description);
                    handleCancel();
                } else if (result.statusCode === StatusCodes.BAD_REQUEST) {
                    handleCancel(result)
                } else if (result.statusCode === StatusCodes.INTERNAL_SERVER_ERROR) {
                    handleCancel(result);
                }
            } else {
                handleCancel();
            }
        }
        save(type)
            .then(() => undefined);

    }

    const handleCancel = (error?) => {
        props.onSaveCancel(error);
    }

    useEffect(() => {
        const callback = async () => {
            if (props.op === "edit" || props.op === "view") {
                const p = await typesApi.get(props.id);
                setType(p);
            } else {
                setType({
                    description: "",
                    image: "",
                })
            }
        }
        callback()
            .then(() => {
                return undefined
            });

    }, [props.id, props.op]);

    const title = props.op === "new" ? "New" :
        props.op === "edit" ? "Edit" : "View";

    const handleOp = (type) => {
        if (props.op !== "view") {
            handleSaveType(type);
        }
    }

    return (
        <Container fluid style={{ padding: "1rem", display: "flex", justifyContent: "center" }}>
            <Row>
                <Col md="auto">
                    <Card border="dark" className="align-content-center" style={{ width: '46.5rem'}}>
                        <Card.Header as="h3">{`${title} Type`}</Card.Header>
                        <Card.Body>
                            <EditTypeForm type={type} op={props.op} onSaveType={handleOp} onCancel={handleCancel}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>

    );
}