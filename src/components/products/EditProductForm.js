import {useEffect, useRef, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {Button, Col, Container, Image, Row} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";

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
    const nameRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();
    const typeRef = useRef();
    const imageRef = useRef();

    const handleSave = (event) => {
        event.preventDefault();
        const product = {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            price: priceRef.current.value,
            type: typeRef.current.value,
            image: imageRef.current.value
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
                                <div align="center">
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
                                           ref={nameRef}
                                           value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea className="form-control" id="description" name="description" required
                                              rows="3"
                                              ref={descriptionRef} value={formData.description} onChange={handleChange}
                                              disabled={viewOnly}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input className="form-control" id="price" name="price" required type="number"
                                           ref={priceRef}
                                           value={formData.price} onChange={handleChange} disabled={viewOnly}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="type">Type</label>
                                    <select className="form-select" id="type" name="type" required ref={typeRef}
                                            value={formData.type}
                                            onChange={handleChange} disabled={viewOnly}>
                                        <option value="">Please Select</option>
                                        {types.map(type => {
                                            return (<option key={type._id}
                                                            value={type.description}>{type.description}</option>);
                                        })}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="image">Image</label>
                                    <input className="form-control" id="image" name="image" required type="url"
                                           ref={imageRef}
                                           value={formData.image} onChange={handleChange} disabled={viewOnly}/>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>


            </form>
            <br/>
            <div className="align-content-end">
                {!viewOnly && (
                    <>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        <span>&nbsp;</span>
                    </>
                )}
                <Button variant="danger" onClick={handleCancel}>{viewOnly ? "Close" : "Cancel"}</Button>
            </div>
        </>
    );
}