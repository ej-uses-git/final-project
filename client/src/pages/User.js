import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import CustomerNavbar from "../components/CustomerNavbar";
import { CacheContext } from "../App";
import { getReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function User(props) {
  const navigate = useNavigate();

  const [perm, setPerm] = useState("");

  const { userId } = useParams();

  const { clearCache, retrieveFromCache, writeToCache } = useContext(
    CacheContext
  );

  const storedUser = localStorage.getItem("currentUser");
  const [info, setInfo] = useState(retrieveFromCache("userInfo"));

  const getFromServer = useCallback(async (item, path) => {
    const cachedArray = retrieveFromCache(item);
    if (cachedArray.length) return;
    const [data, error] = await getReq(path);
    if (error) return useError(error, navigate);
    writeToCache(item, data);
  }, []);

  useEffect(() => {
    if (!storedUser || storedUser !== userId)
      return navigate("/error/not logged in");
    const cachedInfo = retrieveFromCache("userInfo");
    if (cachedInfo.user_id) return;
    (async () => {
      const [data, error] = await getReq(`/users/${storedUser}/info`);
      if (error) return navigate(`/error/${error.message.toLowerCase()}`);
      if (!data) return navigate("/error/not logged in");
      writeToCache("userInfo", data);
      setInfo(data);
      //TODO: use history library to make back arrow functional
    })();
  }, [userId, storedUser]);

  useEffect(() => {
    const { permission, order_id } = info;
    if (!permission) return;
    setPerm(permission);
    if (permission !== "admin") {
      (async () => {
        await getFromServer(
          "userCart",
          `/users/${storedUser}/cart/${info.order_id}`
        );
        await getFromServer(
          "purchaseHistory",
          `/users/${storedUser}/purchase%20history`
        );
        await getFromServer(
          "paymentMethods",
          `/users/${storedUser}/payment%20methods`
        );
      })();
    } else {
      //TODO: fetch admin stuff
    }
  }, [info]);

  return (
    <div>
      {perm && (perm === "admin" ? <AdminNavbar /> : <CustomerNavbar />)}
      {perm && <Outlet />}
      <button
        onClick={() => {
          localStorage.removeItem("currentUser");
          clearCache();
          navigate("/login");
        }}
      >
        Log Out
      </button>
    </div>
  );
}

export default User;
