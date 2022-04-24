import { Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./api/ProtectedRouter";
import { Users } from "./components/users/Users";
import { Layout } from "./components/layout/Layout";
import { Products } from "./components/products/Products";
import {Home} from "./components/layout/Home";
import {Orders} from "./components/orders/Orders";
import {Variations} from "./components/variations/Variations";

function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact><Home/></Route>
                <ProtectedRoute exact path="/products" component={Products} />
                <ProtectedRoute exact path="/variations" component={Variations} />
                <ProtectedRoute exact path="/users" component={Users} />
                <ProtectedRoute exact path="/orders" component={Orders} />
            </Switch>
        </Layout>
    );
}

export default App;
