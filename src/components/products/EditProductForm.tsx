import {useEffect, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {Alert, Card, Col, Container, Image, Row} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import {ALERT_TIMEOUT} from "../../context/ApplicationContext";

export const EditProductForm = (props) => {
    const product = props.product;
    const [formData, setFormData] = useState({
        name: product.name,
        description: "",
        price: 0,
        type: "",
        image: ""
    });

    const [types, setTypes] = useState([]);

    const [alert, setAlert] = useState({
        show: false,
        type: "",
        title: "",
        message: ""
    });

    const handleAlert = (show: boolean, type: string = "", title: string = "", message: string = "") => {
        setAlert({
            show: show,
            type: type,
            title: title,
            message: message
        });
        if (show) {
            setTimeout(() => {
                handleAlert(false);
            }, ALERT_TIMEOUT)
        }
    }

    const handleSave = (event) => {
        event.preventDefault();
        if (!isDataValid()) return;

        const product = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            type: formData.type,
            image: formData.image
        }
        props.onSaveProduct(product);
    }

    const isDataValid = (): boolean => {
        const {name, description, price, type, image} = formData;

        if (name.trim().length === 0 || description.trim().length === 0 ||
            type.trim().length === 0 || image.trim().length === 0) {
            handleAlert(true, "danger", "Validation Error", "All fields are required to save!");
            return false;
        }

        if (Number(price) <= 0) {
            handleAlert(true, "danger", "Validation Error", "Product price must be greater than zero!");
            return false;
        }
        return true;
    }

    const handleCancel = (event) => {
        event.preventDefault();
        props.onCancel();
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    useEffect(() => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            type: product.type,
            image: product.image
        });
    }, [product])

    const handleSelectType = (type) => {
        setFormData(prevState => {
            return {
                ...prevState,
                type: type
            }
        })
    }

    useEffect(() => {
        typesApi.list()
            .then(data => {
                setTypes(data);
            });
    }, []);

    const viewOnly = props.op === "view";
    const title = props.op === "new" ? "New" :
                    props.op === "edit" ? "Edit" : "View";

    return (
        <>
            {alert.show &&
                <div>
                    <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible transition  className="alert-top">
                        <Alert.Heading>{alert.title}</Alert.Heading>
                        <p>{alert.message}</p>
                    </Alert>
                </div>
            }
            <Card border="dark">
                <Card.Header as="h3">{`${title} Product`}</Card.Header>
                <form onSubmit={handleSave}>
                    <Container>
                        <Row>
                            {viewOnly &&
                                <Col>
                                    <div className="container4">
                                        <Image src={imageHelper.getImageUrl(product.image)}
                                               fluid width="350" title={product.image}/>
                                    </div>
                                </Col>
                            }
                            <Col>
                                <div>
                                    <div className="form-group">
                                        <label htmlFor="name">Name<span aria-hidden="true"
                                                                        className="required">*</span></label>
                                        <input className="form-control" id="name" name="name" required type="text"
                                               value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Description<span aria-hidden="true"
                                                                                      className="required">*</span></label>
                                        <textarea className="form-control" id="description" name="description"
                                                  required
                                                  rows={3}
                                                  value={formData.description} onChange={handleChange}
                                                  disabled={viewOnly}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="price">Price<span aria-hidden="true"
                                                                          className="required">*</span></label>
                                        <input className="form-control" id="price" name="price" required
                                               type="number"
                                               value={formData.price} onChange={handleChange} disabled={viewOnly}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="type">Type<span aria-hidden="true"
                                                                        className="required">*</span></label>
                                        <AutoCompleteInput
                                            data={types}
                                            value={formData.type}
                                            disabled={viewOnly}
                                            onFieldSelected={handleSelectType}
                                            className="form-control"
                                            required
                                            placeholder="Please select a type"/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image">Image<span aria-hidden="true"
                                                                          className="required">*</span></label>
                                        <input className="form-control" id="image" name="image" required type="url"
                                               value={formData.image} onChange={handleChange} disabled={viewOnly}/>

                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </form>
            </Card>
            <br/>
            <div className="align-content-end">
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
                <p aria-hidden="true" id="required-description">
                    <span aria-hidden="true" className="required">*</span>Required field(s)
                </p>
            </div>
        </>
    );
}

/*



<Container>
                <Row>
                    {alert.show &&
                        <div className="alert-top">
                            <Alert variant={alert.type} onClose={() => handleAlert(false)} dismissible>
                                <Alert.Heading>{alert.title}</Alert.Heading>
                                <p>{alert.message}</p>
                            </Alert>
                        </div>
                    }
                </Row>
                <Row>
                    <form onSubmit={handleSave}>
                        <Container>
                            <Row>
                                {viewOnly &&
                                    <Col>
                                        <div className="container4">
                                            <hr/>
                                            <Image src={imageHelper.getImageUrl(product.image)}
                                                   fluid width="350" title={product.image}/>
                                        </div>
                                    </Col>
                                }
                                <Col>
                                    <div>
                                        <div className="form-group">
                                            <label htmlFor="name">Name<span aria-hidden="true"
                                                                            className="required">*</span></label>
                                            <input className="form-control" id="name" name="name" required type="text"
                                                   value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="description">Description<span aria-hidden="true"
                                                                                          className="required">*</span></label>
                                            <textarea className="form-control" id="description" name="description"
                                                      required
                                                      rows={3}
                                                      value={formData.description} onChange={handleChange}
                                                      disabled={viewOnly}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="price">Price<span aria-hidden="true"
                                                                              className="required">*</span></label>
                                            <input className="form-control" id="price" name="price" required
                                                   type="number"
                                                   value={formData.price} onChange={handleChange} disabled={viewOnly}/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="type">Type<span aria-hidden="true"
                                                                            className="required">*</span></label>
                                            <AutoCompleteInput
                                                data={types}
                                                value={formData.type}
                                                disabled={viewOnly}
                                                onFieldSelected={handleSelectType}
                                                className="form-control"
                                                required
                                                placeholder="Please select a type"/>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="image">Image<span aria-hidden="true"
                                                                              className="required">*</span></label>
                                            <input className="form-control" id="image" name="image" required type="url"
                                                   value={formData.image} onChange={handleChange} disabled={viewOnly}/>

                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </form>
                </Row>
            </Container>
 */