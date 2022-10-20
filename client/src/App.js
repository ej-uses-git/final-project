import React, { createContext, useCallback, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import "./App.css";
import Cart from "./pages/customer/Cart";
import EditItems from "./pages/admin/EditItems";
import EditProducts from "./pages/admin/EditProducts";
import Info from "./pages/user/Info";
import Landing from "./pages/Landing";
import Login from "./pages/login/Login";
import LoggedIn from "./pages/user/LoggedIn";
import NewItem from "./pages/admin/NewItem";
import NewProduct from "./pages/admin/NewProduct";
import Payments from "./pages/customer/Payments";
import PurchaseHistory from "./pages/customer/PurchaseHistory";
import ProductDetails from "./pages/customer/ProductDetails";
import Register from "./pages/login/Register";
import Shop from "./pages/customer/Shop";
import UploadItemPhotos from "./pages/admin/UploadItemPhotos";
import User from "./pages/user/User";
import Error from "./Error";

export const CacheContext = createContext();

function App() {
  const [cache, setCache] = useState({
    userInfo: {},
    userCart: [],
    purchaseHistory: [],
    paymentMethods: []
  });

  const clearCache = useCallback(() => {
    setCache({
      userInfo: {},
      userCart: [],
      purchaseHistory: [],
      paymentMethods: []
    });
  }, [setCache]);

  const retrieveFromCache = useCallback(
    target => {
      return cache[target];
    },
    [cache]
  );

  const writeToCache = useCallback((target, data, inner) => {
    if (inner) {
      cache[target][inner] = data instanceof Array ? [...data] : { ...data };
      return;
    }

    if (typeof cache[target] === "string") {
      setCache(prev => ({ ...prev, [target]: data }));
    } else if (cache[target] instanceof Array) {
      setCache(prev => ({ ...prev, [target]: [...data] }));
    } else {
      setCache(prev => ({ ...prev, [target]: { ...data } }));
    }
  }, []);

  const cacheUtils = {
    clearCache,
    retrieveFromCache,
    writeToCache
  };

  return (
    <>
      <BrowserRouter>
        <CacheContext.Provider value={cacheUtils}>
          <Routes>
            <Route path="/" element={<Landing />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/users" element={<Outlet />}>
              <Route index element={<LoggedIn />} />

              <Route path=":userId" element={<User />}>
                <Route index element={<Navigate to="info" />} />

                <Route path="info" element={<Info />} />

                <Route path="shop" element={<Outlet />}>
                  <Route index element={<Shop />} />

                  <Route
                    path="products/:productName/:productId"
                    element={<ProductDetails />}
                  />
                </Route>

                <Route path="cart" element={<Cart />} />

                <Route path="payments" element={<Payments />} />

                <Route path="orderhistory" element={<PurchaseHistory />} />
              </Route>

              <Route path="admin/:userId" element={<User />}>
                <Route index element={<Navigate to="info" />} />

                <Route path="info" element={<Info />} />

                <Route path="products" element={<Outlet />}>
                  <Route index element={<Navigate to="new" />} />

                  <Route path="new" element={<NewProduct />} />

                  <Route path="edit" element={<EditProducts />} />

                  <Route path=":productName/:productId" element={<Outlet />}>
                    <Route index element={<EditItems />} />

                    <Route
                      path=":itemId/upload"
                      element={<UploadItemPhotos />}
                    />

                    <Route path="new" element={<NewItem />} />
                  </Route>
                </Route>
              </Route>
            </Route>

            <Route path="error" element={<Outlet />}>
              <Route path=":errorMessage" element={<Error />} />
            </Route>

            <Route path="*" element={<Navigate to="/error/page not found" />} />
          </Routes>
        </CacheContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
