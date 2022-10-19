import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import { CacheContext } from "../App";

function Info(props) {
  const navigate = useNavigate();

  const { userId } = useParams();

  const [info, setInfo] = useState({});

  const { retrieveFromCache, writeToCache } = useContext(CacheContext);

  useEffect(() => {
    const cachedInfo = retrieveFromCache("userInfo");
    console.log("\n== cachedInfo ==\n", cachedInfo, "\n");
    if (!cachedInfo.user_id) {
      (async () => {
        const [data, error] = await getReq(`/users/${userId}/info`);
        if (error) return navigate(`/error/${error.message.toLowerCase()}`);
        if (!data) return navigate("/error/not logged in");
        writeToCache("userInfo", data);
        setInfo(data);
      })();
    }
    setInfo(cachedInfo);
  }, []);

  return (
    <>
      Info
      {Object.keys(info).map(key => (
        <li key={key}>
          <div>{key}:</div>
          <div>{info[key]}</div>
        </li>
      ))}
    </>
  );
  //TODO: improve display
}

export default Info;
