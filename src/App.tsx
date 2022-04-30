import { lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "./api/ProtectedRouter";
import { Home } from "./components/layout/Home";
import { Layout } from "./components/layout/Layout";
import { authActions } from "./store/authSlice";

const Users = lazy(() => import("./components/users/Users").then(({ Users }) => ({ default: Users })));
const Variations = lazy(() => import("./components/variations/Variations").then(({ Variations }) => ({ default: Variations })));
const Products = lazy(() => import("./components/products/Products").then(({ Products }) => ({ default: Products })));
const OrdersMain = lazy(() => import("./components/orders/OrdersMain").then(({ OrdersMain }) => ({ default: OrdersMain })));

function App() {
    const dispatch = useDispatch();
    dispatch(authActions.checkLocalStorage());
    return (
        <Layout>
            <Suspense fallback={"Loading..."}>
                <Switch>
                    <Route path="/" exact><Home/></Route>
                    <ProtectedRoute exact path="/products" component={Products}/>
                    <ProtectedRoute exact path="/variations" component={Variations}/>
                    <ProtectedRoute exact path="/users" component={Users}/>
                    <ProtectedRoute exact path="/orders" component={OrdersMain}/>
                </Switch>
            </Suspense>
        </Layout>
    );
}

export default App;
