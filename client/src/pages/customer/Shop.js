import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Product from "../../components/Product";
import { getReq } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function Shop(props) {
  const navigate = useNavigate();

  const localCache = useRef([[], [], []]);

  const [selector, setSelector] = useState(0);
  const [display, setDisplay] = useState([]);

  const handleChange = useCallback(
    async (e) => {
      setSelector(e.target.value);

      const cachedProducts = localCache.current[e.target.value];

      if (cachedProducts.length) return setDisplay(cachedProducts);

      const [data, error] = await getReq(
        `/types/${parseInt(e.target.value) + 1}/products`
      );
      if (error) return handleError(error, navigate);
      setDisplay(data);
      localCache.current[e.target.value] = data;
    },
    [navigate]
  );

  useEffect(() => {
    handleChange({ target: { value: 0 } });
  }, [handleChange]);

  return (
    <div className="shop">
      <select className="filter" value={selector} onChange={handleChange}>
        <option value={0}>Laptops</option>
        <option value={1}>Sports</option>
        <option value={2}>Video Games</option>
      </select>

      {display.map((product) => (
        <Product
          key={product.product_id}
          path={`products/${product.product_name}/${product.product_id}`}
          product={product}
        />
      ))}
    </div>
  );
}

export default Shop;
