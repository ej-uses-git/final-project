import React, { createContext, useCallback, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate
} from "react-router-dom";
import "./App.css";
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
import UploadItemPhotos from "./pages/UploadItemPhotos";
import User from "./pages/User";
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
    </div>
  );
}

export default App;
