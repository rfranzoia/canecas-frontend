import {Card} from "react-bootstrap";
import {VariationsList} from "./VariationsList";

export const Variations = (props) => {
    return (
        <div>
            <Card as="h2" className="default-margin">
                <Card.Header>Product Variations</Card.Header>
                <Card.Body>
                    <VariationsList />
                </Card.Body>
            </Card>
        </div>
    );
}