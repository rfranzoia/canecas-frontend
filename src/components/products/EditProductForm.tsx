import {useEffect, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {Col, Container, Image, Row} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {AutoCompleteInput} from "../ui/AutoCompleteInput";
import {CustomButton} from "../ui/CustomButton";

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

    const handleSave = (event) => {
        event.preventDefault();
        const product = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            type: formData.type,
            image: formData.image
        }
        props.onSaveProduct(product);
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

    return (
        <>
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
                                    <label htmlFor="name">Name</label>
                                    <input className="form-control" id="name" name="name" required type="text"
                                           value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea className="form-control" id="description" name="description" required
                                              rows={3}
                                              value={formData.description} onChange={handleChange}
                                              disabled={viewOnly}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input className="form-control" id="price" name="price" required type="number"
                                           value={formData.price} onChange={handleChange} disabled={viewOnly}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">Type</label>
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
                                    <label htmlFor="image">Image</label>
                                    <input className="form-control" id="image" name="image" required type="url"
                                           value={formData.image} onChange={handleChange} disabled={viewOnly}/>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>


            </form>
            <br/>
            <div className="align-content-end container4">
                {!viewOnly && (
                    <>
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
            </div>
        </>
    );
}