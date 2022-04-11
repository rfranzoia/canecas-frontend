import { Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./api/ProtectedRouter";
import { Types } from "./components/types/Types";
import { UserLogin } from "./components/users/UserLogin";
import { UserRegisterForm } from "./components/users/UserRegisterForm";
import { Users } from "./components/users/Users";
import { Layout } from "./components/layout/Layout";
import { Products } from "./components/products/Products";
import { NewOrder } from "./components/orders/NewOrder";
import { EditOrder } from "./components/orders/EditOrder";
import {Home} from "./components/layout/Home";
import {MasterDetail} from "./components/md/MasterDetail";

function App() {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact><Home/></Route>
                <ProtectedRoute exact path="/types" component={Types} />
                <ProtectedRoute exact path="/products" component={Products} />
                <ProtectedRoute exact path="/users" component={Users} />
                <ProtectedRoute exact path="/orders" component={MasterDetail} />
                <ProtectedRoute exact path="/orders/new" component={NewOrder} />
                <ProtectedRoute exact path="/orders/:id" component={EditOrder} />
                <Route path="/users/create" exact><UserRegisterForm/></Route>
                <Route path="/users/login" exact><UserLogin/></Route>
            </Switch>
        </Layout>
    );
}

export default App;
