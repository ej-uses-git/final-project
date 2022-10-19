import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function OrderItem(props) {
  const navigate = useNavigate();

  const [photoLink, setPhotoLink] = useState();

  useEffect(() => {
    (async () => {
      const [data, error] = await getReq(`/items/${item.item_id}/photos`);
      if (error) return useError(error, navigate);
      if (!data) return;
      setPhotoLink(data[0]);
    })();
  }, []);

  const { item, onClick } = props;
  return (
    <div className="order-item | bg-primary-600">
      <>
        {photoLink && (
          <img
            src={`http://localhost:8090/images/items/${item.product_name}/${item.item_id}/${photoLink}`}
            alt={item.item_color}
            className="order-item-image | fs-200 ff-body"
          />
        )}
        <div className="container container--small">
          <div className="ff-headings fw-regular fs-200 text-neutral-100">
            Name:
          </div>{" "}
          <div className="ff-body fw-regular fs-200 text-primary-800">
            {item.product_name}
          </div>
        </div>
        <div className="container container--small">
          <div className="ff-headings fw-regular fs-200 text-neutral-100">
            Color:
          </div>{" "}
          <div className="ff-body fw-regular fs-200 text-primary-800">
            {item.item_color.toUpperCase()}
          </div>
        </div>
        <div className="container container--small">
          <div className="ff-headings fw-regular fs-200 text-neutral-100">
            Cost:
          </div>{" "}
          <div className="ff-body fw-regular fs-200 text-primary-800">
            ${item.cost.toFixed(2)}
          </div>
        </div>
        <div className="container container--small">
          <div className="ff-headings fw-regular fs-200 text-neutral-100">
            Amount:
          </div>{" "}
          <div className="ff-body fw-regular fs-200 text-primary-800">
            {item.amount}
          </div>
        </div>
        <div className="order-item-buttons | container container--small">
          <label htmlFor="dec">Decrease amount</label>
          <button
            className="button button--tiny button--inverted"
            id="dec"
            onClick={onClick}
          >
            {" "}
            -{" "}
          </button>
        </div>
      </>
    </div>
  );
}

export default OrderItem;
