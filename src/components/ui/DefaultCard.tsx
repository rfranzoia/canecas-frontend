import {Card} from "react-bootstrap";

export const DefaultCard = (props) => {
    return (
        <Card border="dark" {...props}>
            {props.title &&
                <Card.Header as="h3">{props.title}</Card.Header>
            }
            <Card.Body>{props.children}</Card.Body>
        </Card>
    )
}