export const OrderItems = (props) => {

    const items = props.items.map(item => {
        return (
            <tr key={item._id} className="tr-item">
                <td width="30%">{item.product}</td>
                <td width="5%" align="center">{item.caricatures}</td>
                <td width="15%" align="center">{item.caricatureImages?item.caricatureImages:"-"}</td>
                <td width="5%" align="center">{item.background}</td>
                <td width="15%" align="center">{item.backgroundImage?item.backgroundImage:"-"}</td>
                <td width="10%" align="right">{item.amount}</td>
                <td width="10%" align="right">{item.price.toFixed(2)}</td>
                <td width="10%" align="right">{(item.price * item.amount).toFixed(2)}</td>
            </tr>
        )
    })

    return (
        <>
            <hr/>
            <table width="100%">
                <thead>
                <tr>
                    <td>Product</td>
                    <td align="center">Caricatures</td>
                    <td align="center">Image</td>
                    <td align="center">Background</td>
                    <td align="center">Bg Image</td>
                    <td align="right">Amount</td>
                    <td align="right">Price</td>
                    <td align="right">Total</td>
                </tr>
                </thead>
                <tbody>
                {items}
                </tbody>
            </table>
        </>
    )
}