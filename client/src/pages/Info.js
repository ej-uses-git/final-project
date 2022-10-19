import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import { CacheContext } from "../App";

function Info(props) {
  const navigate = useNavigate();

  const [info, setInfo] = useState({});

  const { retrieveFromCache } = useContext(CacheContext);

  useEffect(() => {
    setInfo(retrieveFromCache("userInfo"));
  }, []);

  return (
    <>
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
