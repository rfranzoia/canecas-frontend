import { PropsWithChildren } from "react";
import { Row } from "react-bootstrap";
import styles from "./borderedRow.module.css";

interface BorderedRowProps {
    required?:boolean,
    title:string,
}

export const BorderedRow = (props: PropsWithChildren<BorderedRowProps>) => {
    const required = props.required && <span aria-hidden="true" className="required">*</span>
    return (
        <Row className={styles["row-border"]}>
            <div className={styles["row-title"]}><p>{props.title}{required}</p></div>
            {props.children}
        </Row>
    );
}