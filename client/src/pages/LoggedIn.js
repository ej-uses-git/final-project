import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CacheContext } from "../App";
import { getReq } from "../utilities/fetchUtils";

function LoggedIn(props) {
  const navigate = useNavigate();

  const { clearCache, retrieveFromCache } = useContext(CacheContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) {
      clearCache();
      return navigate("/error/not logged in");
    }
    const cachedInfo = retrieveFromCache("userInfo");
    if (cachedInfo.userId) {
      if (cachedInfo.userId !== storedUser) {
        clearCache();
        return navigate("/error/not logged in");
      }
      if (cachedInfo.permission === "admin")
        return navigate(`admin/${storedUser}`);
      return navigate(`${storedUser}`);
    }

    (async () => {
      const [data, error] = await getReq(`/users/${storedUser}/info`);
      if (error) return navigate(`/error/${error.message.toLowerCase()}`);
      if (!data) return navigate("/error/not logged in");
      if (data.permission === "admin") return navigate(`admin/${data.user_id}`);
      return navigate(`${data.user_id}`);
      //TODO: use history library to make back arrow functional
    })();
  }, []);

  return <div>Logged In</div>;
}

export default LoggedIn;
