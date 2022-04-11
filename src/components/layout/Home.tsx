import {useContext, useState} from "react";
import {AlertType, ApplicationContext} from "../../context/ApplicationContext";
import {ConfirmModal} from "../ui/ConfirmModal";

export const Home = () => {
    const appCtx = useContext(ApplicationContext);
    const [show, setShow] = useState(false);
    const showAlert = () => {
        setData("");
        setShow(!show)
        appCtx.handleAlert(show, AlertType.SUCCESS, "title", "message")
    }
    const handleConfirm = (data) => {
        console.log(data);
        setShow(false)
    }

    const [data, setData] = useState("");

    const handleChange = (event) => {
        setData(event.target.value);
    }


    return (
        <>
            <ConfirmModal show={show} handleClose={() => setShow(false)} handleConfirm={() => handleConfirm(data)}
                            hasData={true}>
                <form>
                    <p>`Are you sure you want to CANCEL the order # '234234234234234'?,
                        this action cannot be undone`</p>
                    <div className="form-group">
                        <label>Reason</label>
                        <input className="form-control" value={data} onChange={handleChange} />
                    </div>
                </form>
            </ConfirmModal>
            <div className="container4">
                {appCtx.isLoggedIn() &&
                    (
                        <p style={{textAlign: "center"}}>Welcome Back </p>
                    )}
                <h1>Home</h1>
                {data}
                <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                    <button onClick={showAlert}>show alert</button>
                </div>
            </div>
        </>
    );
}