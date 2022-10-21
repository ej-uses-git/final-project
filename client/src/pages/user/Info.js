import React, { useContext, useEffect, useState } from "react";
import { CacheContext } from "../../App";

function Info(props) {
  const [info, setInfo] = useState({});

  const { retrieveFromCache } = useContext(CacheContext);

  useEffect(() => {
    setInfo(retrieveFromCache("userInfo"));
  }, [retrieveFromCache]);

  return (
    <ul className="user-info | bg-primary-600">
      <h2 className="fs-600 fw-bold ff-headings text-neutral-100">
        Your Profile
      </h2>
      {Object.keys(info)
        .filter(key => key !== "user_id" && key !== "order_id")
        .map(key => (
          <li key={key} className="container">
            <div className="fs-200 ff-headings fw-bold">
              {key.replaceAll("_", " ").toUpperCase()}:
            </div>
            <div className="ff-body">{info[key]}</div>
          </li>
        ))}
    </ul>
  );
}

export default Info;
