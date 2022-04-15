import {useEffect, useState} from "react";
import classes from "./AutoCompleteInput.module.css";

export const AutoCompleteInput = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [data, setData] = useState([]);
    const [field, setField] = useState("");
    const [displayFields, setDisplayFields] = useState([]);

    useEffect(() => {
        setData(props.data);
        setField(props.value);

        if (props.displayFields) {
            setDisplayFields(props.displayFields.split(","));
        } else {
            setDisplayFields([props.displayField])
        }

    },[props.data, props.value, props.displayField, props.displayFields]);

    const handleChange = (event) => {
        const value = event.target.value;

        suggestionsFilter(value);

        setField(value);
    }

    const suggestionsFilter = (value) => {
        let s = [];
        if (value) {
            s = data.filter(d => {
                return displayFields.filter(df => d[df].toLowerCase().includes(value.toLowerCase())).length > 0
            })
        }
        setSuggestions(s);
    }

    const renderSuggestions = () => {
        if (suggestions.length === 0) {
            return null
        }

        const arr = suggestions.map(s => {
            const inner = displayFields.map(df => {
                return s[df];
            })
            return { _id: s._id, value: inner.join((" - "))}
        })

        return (
            <ul>
                {arr.map(a => {
                    return (
                        <li key={a._id} onClick={() => handleFieldSelected(a.value.split(" - ")[0])}>{a.value}</li>
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