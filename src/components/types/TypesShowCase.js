import {Button, Carousel, Container, Image, Modal, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {typesApi} from "../../api/TypesAPI";
import {imageHelper} from "../ui/ImageHelper";
import {ProductsShowCase} from "../products/ProductsShowCase";

export const TypesShowCase = () => {
    const [types, setTypes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState({})

    useEffect(() => {
        typesApi.list()
            .then(data => {
                setTypes(data);
            });
    }, []);

    const handleClickType = async (type) => {
        setType(type);
        setShowModal(true);
    }

    const handleClose = () => {
        setShowModal(false);
    }

    return (

        <>
            <Container style={{padding: "0.5rem", justifyContent: "center", width: "100rem", display: "flex"}}>
                <Table>
                    <tbody>
                        <tr>
                            {types.map((type) => {
                                return (
                                    <td key={type._id}>
                                        <Image src={imageHelper.getImageUrl(type.image)} onClick={() => handleClickType(type)}
                                               fluid width="600" title={type.image}/>
                                        <div>
                                            {type.description}
                                        </div>
                                    </td>
                                )
                            })}
                        </tr>
                    </tbody>
                </Table>
            </Container>
            <Modal show={showModal} onHide={handleClose} backdrop="static" keyboard={true} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{type.description}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ProductsShowCase type={type}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>

        </>

    );
}