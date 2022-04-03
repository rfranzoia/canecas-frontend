import {useEffect, useRef, useState} from "react";
import {Button} from "react-bootstrap";

export const EditTypeForm = (props) =>  {
    const type = props.type;
    const [formData, setFormData] = useState({
        description: "",
    });

    const descriptionRef = useRef();

    const handleSave = (event) => {
        event.preventDefault();
        const type = {
            description: descriptionRef.current.value,
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
        });
    }, [type.description])

    const viewOnly = props.op === "view";

    return (
        <>
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label htmlFor="description">Name</label>
                    <input className="form-control" id="name" name="description" required type="text" ref={descriptionRef}
                           value={formData.description} onChange={handleChange} disabled={viewOnly}/>
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