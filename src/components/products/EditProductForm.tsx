import {useContext, useEffect, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {Card, Col, Container, Image, Row} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {AlertToast} from "../ui/AlertToast";

export const EditProductForm = (props) => {
    const appCtx = useContext(ApplicationContext);
    const product = props.product;
    const [formData, setFormData] = useState({
        name: product.name,
        description: "",
        price: 0,
        type: "",
        image: ""
    });

    const [types, setTypes] = useState([])

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
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "All fields are required to save!");
            return false;
        }

        if (Number(price) <= 0) {
            appCtx.handleAlert(true, AlertType.DANGER, "Validation Error", "Product price must be greater than zero!");
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

    const handleNumberInput = (e) => {
        let {name, value} = e.target;
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
        if (isNaN(value)) {
            value = 0;
        }
        setFormData(prevState => {
            return {
                ...prevState,
                [name]: Number(value).toFixed(2)
            }
        });
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
            <AlertToast />
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
                                        <input
                                            className="form-control"
                                            required
                                            type="text"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            style={{textAlign: "right"}}
                                            disabled={viewOnly}
                                            onInput={handleNumberInput}/>
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
            <div className="default-margin">
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
