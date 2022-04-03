import {useEffect, useRef, useState} from "react";
import {Button, Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";

export const EditTypeForm = (props) =>  {
    const type = props.type;
    const [formData, setFormData] = useState({
        description: "",
        image: "",
    });

    const descriptionRef = useRef();
    const imageRef = useRef();

    const handleSave = (event) => {
        event.preventDefault();
        const type = {
            description: descriptionRef.current.value,
            image: imageRef.current.value,
        }
        props.onSaveType(type);
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
            description: type.description,
            image: type.image,
        });
    }, [type.description, type.image])



    const viewOnly = props.op === "view";

    return (
        <>
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label htmlFor="description">Name</label>
                    <input className="form-control" id="name" name="description" required type="text" ref={descriptionRef}
                           value={formData.description} onChange={handleChange} disabled={viewOnly}/>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input className="form-control" id="image" name="image" required type="url" ref={imageRef}
                           value={formData.image} onChange={handleChange} disabled={viewOnly}/>
                    {viewOnly &&
                        <div align="center">
                            <hr/>
                            <Image src={imageHelper.getImageUrl(type.image)}
                                   fluid width="400" title={type.image}/>
                        </div>
                    }
                </div>
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