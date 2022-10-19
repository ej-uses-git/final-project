import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function OrderItem(props) {
  const navigate = useNavigate();

  const [photoLinks, setPhotoLinks] = useState([]);

  useEffect(() => {
    (async () => {
      const [data, error] = await getReq(`/items/${item.item_id}/photos`);
      if (error) return useError(error, navigate);
      if (!data) return;
      setPhotoLinks(data);
    })();
  }, []);

  const { item, onClick } = props;
  return (
    <div>
      <div>
        Item:
        {photoLinks[0] && (
          <img
            src={`http://localhost:8090/images/items/${item.product_name}/${item.item_id}/${photoLinks[0]}`}
            alt={item.product_name + " " + item.item_color}
          />
        )}
        <div>Name: {item.product_name}</div>
        <div>Color: {item.item_color.toUpperCase()}</div>
        <div>Cost: ${item.cost.toFixed(2)}</div>
        <div>Amount: {item.amount}</div>
        <label htmlFor="dec">Decrease amount</label>
        <button id="dec" onClick={onClick}>
          {" "}
          -{" "}
        </button>
      </div>
    </div>
  );
}

export default OrderItem;
