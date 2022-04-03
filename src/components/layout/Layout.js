import {Header} from "./Header";
import {Footer} from "./Footer";

export const Layout = (props) => {
    return (
        <div>
            <Header />
            <main>{props.children}</main>
            <Footer />
        </div>
    )
}