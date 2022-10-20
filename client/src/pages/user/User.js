import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";
import CustomerNavbar from "../../components/CustomerNavbar";
import { CacheContext } from "../../App";
import { getReq } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function User(props) {
  const navigate = useNavigate();

  const [perm, setPerm] = useState("");

  const { userId } = useParams();

  const { clearCache, retrieveFromCache, writeToCache } =
    useContext(CacheContext);

  const storedUser = localStorage.getItem("currentUser");
  const [info, setInfo] = useState(retrieveFromCache("userInfo"));

  const getFromServer = useCallback(
    async (item, path) => {
      const cachedArray = retrieveFromCache(item);
      if (cachedArray.length) return;
      const [data, error] = await getReq(path);
      if (error) return handleError(error, navigate);
      writeToCache(item, data);
    },
    [navigate, retrieveFromCache, writeToCache]
  );

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
    })();
  }, [navigate, retrieveFromCache, writeToCache, userId, storedUser]);

  useEffect(() => {
    const { permission, order_id } = info;
    if (!permission) return;
    setPerm(permission);
    if (permission !== "admin") {
      (async () => {
        if (!order_id) return;
        await getFromServer(
          "userCart",
          `/users/${storedUser}/cart/${order_id}`
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
    }
  }, [info, getFromServer, storedUser]);

  return (
    <div className="user-page">
      {perm && (perm === "admin" ? <AdminNavbar /> : <CustomerNavbar />)}
      {perm && <Outlet />}
      <button
        className="log-out | button"
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
