import {useEffect, useState} from "react";
import {Image} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {CustomButton} from "../ui/CustomButton";

export const EditTypeForm = (props) =>  {
    const type = props.type;
    const [formData, setFormData] = useState({
        description: "",
        image: "",
    });

    const handleSave = (event) => {
        event.preventDefault();
        const type = {
            description: formData.description,
            image: formData.image,
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
                    <input className="form-control" id="name" name="description" required type="text" 
                           value={formData.description} onChange={handleChange} disabled={viewOnly}/>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input className="form-control" id="image" name="image" required type="url" 
                           value={formData.image} onChange={handleChange} disabled={viewOnly}/>
                    {viewOnly &&
                        <div className="container4">
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
                        <CustomButton caption="Save" onClick={handleSave} type="save"/>
                        <span>&nbsp;</span>
                    </>
                )}
                <CustomButton caption={viewOnly ? "Close" : "Cancel"} onClick={handleCancel} type="close"/>
            </div>
        </>
    );
}