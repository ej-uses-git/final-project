import React, { createContext, useCallback, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import Cart from "./pages/Cart";
import EditItems from "./pages/EditItems";
import EditProducts from "./pages/EditProducts";
import Info from "./pages/Info";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import LoggedIn from "./pages/LoggedIn";
import NewProduct from "./pages/NewProduct";
import Payments from "./pages/Payments";
import PurchaseHistory from "./pages/PurchaseHistory";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import User from "./pages/User";
import Error from "./Error";

export const CacheContext = createContext();

function App() {
  const cache = useRef({
    userInfo: {},
    userCart: [],
    purchaseHistory: [],
    paymentMethods: []
  });

  const clearCache = useCallback(() => {
    cache.current = {
      userInfo: {},
      userCart: [],
      purchaseHistory: [],
      paymentMethods: []
    };
  }, []);

  const retrieveFromCache = useCallback(target => {
    return cache.current[target];
  }, []);

  const writeToCache = useCallback((target, data, inner) => {
    if (inner) {
      cache.current[target][inner] =
        data instanceof Array ? [...data] : { ...data };
      return;
    }

    if (typeof cache.current[target] === "string") {
      cache.current[target] = data;
    } else if (cache.current[target] instanceof Array) {
      cache.current[target] = [...data];
    } else {
      cache.current[target] = { ...data };
    }
  }, []);

  const cacheUtils = {
    clearCache,
    retrieveFromCache,
    writeToCache
  };

  return (
    <div className="App">
      <BrowserRouter>
        <CacheContext.Provider value={cacheUtils}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/users" element={<Outlet />}>
              <Route index element={<LoggedIn />} />
              <Route path=":userId" element={<User />}>
                <Route index element={<Navigate to="./info" />} />
                <Route path="info" element={<Info />} />
                <Route path="shop" element={<Outlet />}>
                  <Route index element={<Shop />} />
                  <Route
                    path="products/:productId"
                    element={<ProductDetails />}
                  />
                </Route>
                <Route path="cart" element={<Cart />} />
                <Route path="payments" element={<Payments />} />
                <Route path="orderhistory" element={<PurchaseHistory />} />
              </Route>
              <Route path="admin/:userId" element={<User />}>
                <Route index element={<Navigate to="./info" />} />
                <Route path="info" element={<Info />} />
                <Route path="products" element={<Outlet />}>
                  <Route index element={<Navigate to="./new" />} />
                  <Route path="new " element={<NewProduct />} />
                  <Route path="edit" element={<EditProducts />} />
                  <Route path=":productId" element={<EditItems />} />
                </Route>
              </Route>
            </Route>
            <Route path="error" element={<Outlet />}>
              <Route path=":errorMessage" element={<Error />} />
            </Route>
            <Route
              path="*"
              element={<Navigate to="/error/something went wrong" />}
            />
          </Routes>
        </CacheContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
