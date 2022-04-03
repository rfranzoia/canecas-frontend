import {Route, Switch} from "react-router-dom";
import {Layout} from "./components/layout/Layout";
import {Products} from "./components/products/Products";
import {Home} from "./Home";
import {Types} from "./components/types/Types";
import {UserRegisterForm} from "./components/users/UserRegisterForm";
import {UserLogin} from "./components/users/UserLogin";
import {ProtectedRoute} from "./api/ProtectedRoute";
import {Orders} from "./components/orders/Orders";
import {NewOrder} from "./components/orders/NewOrder";
import {EditOrder} from "./components/orders/EditOrder";
import {Users} from "./components/users/Users";

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
                <Route path="/users/create" exact><UserRegisterForm/></Route>
                <Route path="/users/login" exact><UserLogin/></Route>
            </Switch>
        </Layout>)
}

export default App;

// <ProtectedRoute exact path="/types" component={Types} />
// <Route path="/types" exact><Types/></Route>