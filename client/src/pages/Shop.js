import React, { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  //TODO: display main photo for each product
  //TODO: change dynamically and store products in local cache
  //TODO: link to product details page for each product
  return (
    <>
      <select value={selector} onChange={handleChange}>
        <option value={0}>Laptops</option>
        <option value={1}>Sports</option>
        <option value={2}>Video Games</option>
      </select>

      {display.map(product => JSON.stringify(product))}
    </>
  );
}

export default Shop;
