import { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { BsCaretDown } from "react-icons/bs";
import { GrFormClose } from "react-icons/gr";
import styles from "./autoCompleteInput.module.css";

export const AutoCompleteInput = (props) => {
    const [suggestions, setSuggestions] = useState([]);
    const [data, setData] = useState([]);
    const [field, setField] = useState("");
    const [displayFields, setDisplayFields] = useState([]);

    const AUTOCOMPLETE_FIELD_JOINER = " // ";
    const AUTOCOMPLETE_DISPLAY_FIELDS_SEPARATOR = ",";

    useEffect(() => {
        setField(props.value);
        setData(props.data);

        if (props.displayFields) {
            setDisplayFields(props.displayFields.split(AUTOCOMPLETE_DISPLAY_FIELDS_SEPARATOR));
        } else {
            setDisplayFields([props.displayField])
        }

    }, [props.data, props.value, props.displayField, props.displayFields]);

    useEffect(() => {
        if (data && data.length > 0) {
            data.sort((x, y) => {
                const a = x[displayFields[0]].toLowerCase();
                const b = y[displayFields[0]].toLowerCase();
                return a === b ? 0 : a > b ? 1 : -1;
            })
        }
    }, [data, displayFields])

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
            return {_id: s._id, value: inner.join((AUTOCOMPLETE_FIELD_JOINER))}
        })

        return (
            <ul>
                {arr.map(a => {
                    return (
                        <li key={a._id}
                            onClick={() => handleFieldSelected(a.value.split(AUTOCOMPLETE_FIELD_JOINER)[0])}>{a.value}</li>
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
        <div className={styles.AutoCompleteText}>
            <IconContext.Provider value={{color: "black", size: '1.8rem'}}>
                <input type="text"
                       id="autocompleteInput"
                       onChange={handleChange}
                       value={field}
                       className={props.className}
                       style={props.style}
                       disabled={props.disabled}
                       required={props.required}
                       placeholder={props.placeholder}
                       autoComplete="off"
                       onKeyUp={handleKeyPress}
                />
                {suggestions.length === 0 ?
                    <BsCaretDown className={styles.iconText}
                                 onClick={handleClickIcon}
                                 style={{pointerEvents: (props.disabled) ? "none" : "all"}}/>
                    :
                    <GrFormClose className={styles.iconText}
                                 onClick={handleClickIcon}
                                 style={{pointerEvents: (props.disabled) ? "none" : "all"}}/>
                }

            </IconContext.Provider>
            <div>
                {renderSuggestions()}
            </div>
        </div>
    );
}