import React, { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function NewItem(props) {
  const navigate = useNavigate();

  const { productId } = useParams();

  const color = useRef();
  const amount = useRef();

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const [, error] = await postReq(`/products/${productId}`, {
      color: color.current.value,
      amount: amount.current.value
    });
    if (error) return useError(error, navigate);
    alert("Creation succesful!");
    e.target.reset();
  }, []);

  return (
    <>
      <form className="def-form flex-col" onSubmit={handleSubmit}>
        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="color"
          >
            Enter a color:
          </label>
          <input required type="text" name="color" id="color" ref={color} />
        </div>

        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="amount"
          >
            Enter amount in stock:
          </label>
          <input
            required
            type="number"
            name="amount"
            id="amount"
            min="1"
            ref={amount}
          />
        </div>

        <button className="new-product-button button" type="submit">
          Create New Product
        </button>
      </form>
    </>
  );
}

export default NewItem;
