import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import handleError from "../utilities/handleError";

function Item(props) {
  //TODO: use item.product_name and not from params
  const navigate = useNavigate();

  const amountInput = useRef();

  const { productName } = props;

  const [photoLinks, setPhotoLinks] = useState([]);

  useEffect(() => {
    if (photoLinks.length) return;
    (async () => {
      const [data, error] = await getReq(`/items/${props.itemId}/photos`);
      if (error) return handleError(error, navigate);
      if (!data) return;
      setPhotoLinks(data);
    })();
  }, [navigate, props.itemId, photoLinks.length]);

  return (
    <div className="item">
      {photoLinks.map((link) => (
        <img
          src={`http://localhost:8090/images/items/${productName}/${props.itemId}/${link}`}
          alt={productName + " " + props.color}
          key={props.itemId}
          className="order-item-image | fs-200 fw-regular ff-body text-primary-800"
        />
      ))}
      <h4 className="ff-headings fw-bold fs-400 text-neutral-100">
        {productName}
      </h4>
      <h5 className="ff-body fw-bold fs-200 text-primary-800">
        {props.color.toUpperCase()}
      </h5>
      <p className="ff-body fw-regular fs-200 text-primary-800">
        ${props.cost.toFixed(2)}
      </p>

      <p className="ff-body fw-regular fs-200 text-primary-800">
        {props.itemAmount === 0 && "Out of stock"}
      </p>

      {props.addToCart && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.addToCart(amountInput.current.value);
            e.target.reset();
          }}
          className="container container--tiny"
        >
          <input
            defaultValue={1}
            type="number"
            name="amount"
            id="amount"
            ref={amountInput}
            min={1}
            max={props.itemAmount}
          />
          <button className="button button--small" type="submit">
            Add To Cart
          </button>
        </form>
      )}
    </div>
  );
}

export default Item;
