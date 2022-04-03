import {Card} from "react-bootstrap";

export const DefaultCard = (props) => {
    return (
        <Card border="dark" {...props}>
            <Card.Header as="h4">{props.title}</Card.Header>
            <Card.Body>{props.children}</Card.Body>
        </Card>
    )
}