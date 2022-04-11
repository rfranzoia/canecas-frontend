
export const Details = (props) => {

    const items = props.items.map(item => {
        return (
            <tr key={item._id}>
                <td width="40%">{item.product}</td>
                <td width="10%" align="left">{item.amount}</td>
                <td width="20%" align="right">{item.price.toFixed(2)}</td>
                <td width="20%" align="right">{(item.price*item.amount).toFixed(2)}</td>
            </tr>
        )
    })

    return (
        <>
            <hr/>
            <table width="100%">
                <thead><tr>
                    <td>Product</td>
                    <td>Amount</td>
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