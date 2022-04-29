import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./api/ProtectedRouter";
import { Home } from "./components/layout/Home";
import { Layout } from "./components/layout/Layout";
import { OrdersMain } from "./components/orders/OrdersMain";
import { Products } from "./components/products/Products";
import { Users } from "./components/users/Users";
import { Variations } from "./components/variations/Variations";
import { authActions } from "./store/authSlice";

function App() {
    const dispatch = useDispatch();
    dispatch(authActions.checkLocalStorage());
    return (
        <Layout>
            <Switch>
                <Route path="/" exact><Home/></Route>
                <ProtectedRoute exact path="/products" component={Products}/>
                <ProtectedRoute exact path="/variations" component={Variations}/>
                <ProtectedRoute exact path="/users" component={Users}/>
                <ProtectedRoute exact path="/orders" component={OrdersMain}/>
            </Switch>
        </Layout>
    );
}

export default App;
