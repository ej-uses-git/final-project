import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Product from "../components/Product";
import { getReq, uploadFile } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function EditProducts(props) {
  //TODO: enable sending UPLOAD Main Photo

  const navigate = useNavigate();

  const localCache = useRef([[], [], []]);

  const [selector, setSelector] = useState(0);
  const [display, setDisplay] = useState([]);

  const handleChange = useCallback(async e => {
    setSelector(e.target.value);

    const cachedProducts = localCache.current[e.target.value];

    if (cachedProducts.length) return setDisplay(cachedProducts);

    const [data, error] = await getReq(
      `/types/${parseInt(e.target.value) + 1}/products`
    );
    if (error) return useError(error, navigate);
    setDisplay(data);
    localCache.current[e.target.value] = data;
  }, []);

  useEffect(() => {
    handleChange({ target: { value: 0 } });
  }, []);

  return (
    <>
      <select value={selector} onChange={handleChange}>
        <option value={0}>Laptops</option>
        <option value={1}>Sports</option>
        <option value={2}>Video Games</option>
      </select>

      {display.map(product => (
        <Product
          path={`../${product.product_name}/${product.product_id}`}
          product={product}
        />
      ))}

      <Link to="../new">
        <button>Add New Product</button>
      </Link>
    </>
  );
}

export default EditProducts;
