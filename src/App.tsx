import { Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./api/ProtectedRouter";
import { Types } from "./components/types/Types";
import { Users } from "./components/users/Users";
import { Layout } from "./components/layout/Layout";
import { Products } from "./components/products/Products";
import { NewOrder } from "./components/orders/NewOrder";
import { EditOrder } from "./components/orders/EditOrder";
import {Home} from "./components/layout/Home";
import {Orders} from "./components/orders/Orders";

function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact><Home/></Route>
                <ProtectedRoute exact path="/types" component={Types} />
                <ProtectedRoute exact path="/products" component={Products} />
                <ProtectedRoute exact path="/users" component={Users} />
                <ProtectedRoute exact path="/orders" component={Orders} />
                <ProtectedRoute exact path="/orders/new" component={NewOrder} />
                <ProtectedRoute exact path="/orders/:id" component={EditOrder} />
            </Switch>
        </Layout>
    );
}

export default App;
