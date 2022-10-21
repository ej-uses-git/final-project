import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postReq } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function NewProduct(props) {
  const navigate = useNavigate();

  const [type, setType] = useState(1);

  const productName = useRef();
  const description = useRef();
  const cost = useRef();
  const brand = useRef();

  const handleChange = useCallback((e) => {
    setType(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const [, error] = await postReq(`/products`, {
        productName: productName.current.value,
        description: description.current.value,
        typeId: type,
        cost: cost.current.value,
        brand: brand.current.value,
      });
      if (error) return handleError(error, navigate);
      alert("Creation succesful!");
      e.target.reset();
    },
    [navigate, type]
  );

  return (
    <>
      <form className="def-form flex-col" onSubmit={handleSubmit}>
        <select
          required
          name="type"
          id="type"
          value={type}
          onChange={handleChange}
          className="filter"
        >
          <option value={1}>Laptops</option>
          <option value={2}>Sports</option>
          <option value={3}>Video Games</option>
        </select>

        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="product-name"
          >
            Enter product name:
          </label>
          <input
            required
            type="text"
            name="productName"
            id="product-name"
            ref={productName}
          />
        </div>

        <div className="flex-col">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="description"
          >
            Enter product description:
          </label>
          <textarea
            required
            name="description"
            id="description"
            ref={description}
          ></textarea>
        </div>

        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="cost"
          >
            Enter product cost:
          </label>
          <input
            required
            type="number"
            name="cost"
            id="cost"
            min="1"
            step="any"
            ref={cost}
          />
        </div>

        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="brand"
          >
            Enter brand name:
          </label>
          <input required type="text" name="brand" id="brand" ref={brand} />
        </div>

        <button className="new-product-button button" type="submit">
          Create New Product
        </button>
      </form>
    </>
  );
}

export default NewProduct;
