import {useEffect, useState} from "react";
import {Image, Table} from "react-bootstrap";
import {imageHelper} from "../ui/ImageHelper";
import {productsApi} from "../../api/ProductsAPI";

export const ProductsShowCase = (props) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            setProducts(await productsApi.listByType(props.type.description))
        }
        getProducts().then(() => undefined);

    }, [products, props.type.description]);

    return (
        <Table hover>
            <tbody>
            {
                products.map(p => {
                    return (
                        <tr key={p._id}>
                            <td>
                                <Image src={imageHelper.getImageUrl(p.image)}
                                       fluid width="300" title={p.image}/>
                            </td>
                            <td>
                                <h3>{p.name}</h3>
                                <p>{p.description}</p>
                            </td>
                        </tr>
                    )})
            }
            </tbody>

        </Table>
    );
}