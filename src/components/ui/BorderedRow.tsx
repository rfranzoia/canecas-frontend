import { Row } from "react-bootstrap";
import styles from "./borderedRow.module.css";

export const BorderedRow = (props) => {
    const required = props.required && <span aria-hidden="true" className="required">*</span>
    return (
        <Row className={styles["row-border"]}>
            <div className={styles["row-title"]}><p>{props.title}{required}</p></div>
            {props.children}
        </Row>
    );
}