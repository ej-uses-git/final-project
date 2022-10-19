import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function Shop(props) {
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
    if (error) useError(error, navigate);
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
        <Link to={`products/${product.product_id}`} key={product.product_id}>
          <img
            src={`http://localhost:8090/images/mainphotos/${product.product_id}.jpg`}
            alt={product.product_name}
          />
          <h3>{product.product_name}</h3>
          <p>{product.description}</p>
          <p>{product.cost}</p>
        </Link>
      ))}
    </>
  );
}

export default Shop;
