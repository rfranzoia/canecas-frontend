import {useEffect, useRef, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {Button, Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";

export const EditProductForm = (props) => {
    const product = props.product;
    const [formData, setFormData] = useState({
        name: product.name,
        description: "",
        price: 0,
        type: ""
    });

    const [types, setTypes] = useState([]);
    const nameRef = useRef();
    const descriptionRef = useRef();
    const priceRef = useRef();
    const typeRef = useRef();

    const handleSave = (event) => {
        event.preventDefault();
        const product = {
            name: nameRef.current.value,
            description: descriptionRef.current.value,
            price: priceRef.current.value,
            type: typeRef.current.value
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
            type: product.type
        });
    }, [product.name, product.description, product.price, product.type])

    useEffect(() => {
        typesApi.list()
            .then(data => {
                setTypes(data);
            });
    }, []);

    const findTypeImage = (typeDescription) => {
        const type = types.find(t => t.description === typeDescription);
        return type? type.image: "";
    }
    const viewOnly = props.op === "view";

    return (
        <>
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input className="form-control" id="name" name="name" required type="text" ref={nameRef}
                           value={formData.name} onChange={handleChange} disabled={viewOnly}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description" name="description" required rows="4"
                              ref={descriptionRef} value={formData.description} onChange={handleChange} disabled={viewOnly}/>
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input className="form-control" id="price" name="price" required type="number" ref={priceRef}
                           value={formData.price?formData.price.toFixed(2):0.00} onChange={handleChange} disabled={viewOnly}/>
                </div>
                <div className="form-group">
                    <label htmlFor="type">Type</label>
                    <select className="form-select" id="type" name="type" required ref={typeRef} value={formData.type}
                            onChange={handleChange} disabled={viewOnly}>
                        <option value="">Please Select</option>
                        {types.map(type => {
                            return (<option key={type._id} value={type.description}>{type.description}</option>);
                        })}
                    </select>
                </div>
                {viewOnly &&
                    <div align="center">
                        <hr/>
                        <Image src={imageHelper.getImageUrl(findTypeImage(formData.type))}
                               fluid width="300" title={formData.type}/>
                    </div>
                }
            </form>
            <br/>
            <div className="align-content-end">
                {!viewOnly && (
                    <>
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        <span>&nbsp;</span>
                    </>
                )}
                <Button variant="danger" onClick={handleCancel}>{viewOnly?"Close":"Cancel"}</Button>
            </div>
        </>
    );
}