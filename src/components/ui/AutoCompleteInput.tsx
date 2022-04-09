import {useEffect, useState} from "react";
import classes from "./AutoCompleteInput.module.css";

export const AutoCompleteInput = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [data, setData] = useState([]);
    const [field, setField] = useState("");
    const [displayField, setDisplayField] = useState("");

    useEffect(() => {
        setData(props.data);
        setField(props.value);
        setDisplayField(props.displayField?props.displayField:"description");
    },[props.data, props.value, props.displayField]);

    const handleChange = (event) => {
        const value = event.target.value;
        let s = [];
        if (value.length > 0) {
            s = data.filter(d => {
                return d[displayField].toLowerCase().includes(value.toLowerCase());
            });
        }
        setSuggestions(s);
        setField(value);
    }

    const renderSuggestions = () => {
        if (suggestions.length === 0) {
            return null
        }
        return (
            <ul>
                {suggestions.map(s => {
                    return (
                        <li key={s._id} onClick={() => handleFieldSelected(s[displayField])}>{s[displayField]}</li>
                    )
                })}
            </ul>
        )
    }

    const handleFieldSelected = (field) => {
        setField(field);
        setSuggestions([]);
        props.onFieldSelected(field)
    }

    return (
        <div className={classes.AutoCompleteText}>
            <input type="text"
                   onChange={handleChange}
                   value={field}
                   className={props.className}
                   disabled={props.disabled}
                   required={props.required}
                   placeholder={props.placeholder}
                    />
            <div>
                {renderSuggestions()}
            </div>
        </div>
    );
}