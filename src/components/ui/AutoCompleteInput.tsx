import {useEffect, useState} from "react";
import classes from "./AutoCompleteInput.module.css";
import {IconContext} from "react-icons";
import {BsCaretDown, GrFormClose} from "react-icons/all";

export const AutoCompleteInput = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [data, setData] = useState([]);
    const [field, setField] = useState("");
    const [displayFields, setDisplayFields] = useState([]);

    const AUTOCOMPLETE_FIELD_JOINER = " // ";
    const AUTOCOMPLETE_DISPLAY_FIELDS_SEPARATOR = ",";

    useEffect(() => {
        setData(props.data);
        setField(props.value);

        if (props.displayFields) {
            setDisplayFields(props.displayFields.split(AUTOCOMPLETE_DISPLAY_FIELDS_SEPARATOR));
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
            return { _id: s._id, value: inner.join((AUTOCOMPLETE_FIELD_JOINER))}
        })

        return (
            <ul>
                {arr.map(a => {
                    return (
                        <li key={a._id} onClick={() => handleFieldSelected(a.value.split(AUTOCOMPLETE_FIELD_JOINER)[0])}>{a.value}</li>
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

    const handleClickIcon = () => {
        if (suggestions.length > 0) {
            setSuggestions([])
            setField("")
            document.getElementById("autocompleteInput").focus();
        } else {
            setSuggestions(data);
        }
    }

    const handleKeyPress = (event) => {
        if (event.code.toLowerCase() === "escape") {
            setSuggestions([])
            setField("")
            document.getElementById("autocompleteInput").focus();
        }
    }

    return (
        <div className={classes.AutoCompleteText}>
            <IconContext.Provider value={{ color: "black", size: '1.3rem' }}>
            <input type="text"
                   id="autocompleteInput"
                   onChange={handleChange}
                   value={field}
                   className={props.className}
                   disabled={props.disabled}
                   required={props.required}
                   placeholder={props.placeholder}
                   autoComplete="off"
                   onKeyUp={handleKeyPress}
                    />
                {suggestions.length === 0?
                    <BsCaretDown className={classes.iconText}
                                     onClick={handleClickIcon}
                                     style={{ pointerEvents: (props.disabled)?"none":"all"}} />
                :
                    <GrFormClose className={classes.iconText}
                                     onClick={handleClickIcon}
                                     style={{ pointerEvents: (props.disabled)?"none":"all"}} />
                }

            </IconContext.Provider>
            <div>
                {renderSuggestions()}
            </div>
        </div>
    );
}