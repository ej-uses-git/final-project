import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function Item(props) {
  const navigate = useNavigate();

  const { productName } = useParams();

  const [photoLinks, setPhotoLinks] = useState([]);

  useEffect(() => {
    (async () => {
      const [data, error] = await getReq(`/items/${props.itemId}/photos`);
      if (error) return useError(error, navigate);
      if (!data) return;
      setPhotoLinks(data);
    })();
  }, []);

  return (
    <div>
      {photoLinks.map(link => (
        <img
          src={`http://localhost:8090/images/items/${productName}/${props.itemId}/${link}`}
          alt={productName + " " + props.color}
          key={props.itemId}
        />
      ))}
      <h4>{productName}</h4>
      <h5>{props.color}</h5>
    </div>
  );
}

export default Item;
