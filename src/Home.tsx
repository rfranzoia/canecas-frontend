import {CustomButton} from "./components/ui/CustomButton";

export const Home = () => {

    const handleClick = () => {
        //console.log(alert);
    }

    return (
        <>
            <div className="container4">
                <h1>Home</h1>
                <CustomButton
                    caption="click me!"
                    type="new"
                    customClass="fa fa-file-invoice"
                    onClick={handleClick} />
            </div>
        </>
    );
}

// <Button caption="click me!" type="confirm" onClick={handleClick} />