import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Product from "../../components/Product";
import { getReq, uploadFile } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function EditProducts(props) {
  const navigate = useNavigate();

  const localCache = useRef([[], [], []]);

  const [selector, setSelector] = useState(0);
  const [display, setDisplay] = useState([]);

  const handleChange = useCallback(async (e) => {
    setSelector(e.target.value);

    const cachedProducts = localCache.current[e.target.value];

    if (cachedProducts.length) return setDisplay(cachedProducts);

    const [data, error] = await getReq(
      `/types/${parseInt(e.target.value) + 1}/products`
    );
    if (error) return handleError(error, navigate);
    setDisplay(data);
    localCache.current[e.target.value] = data;
  }, []);

  useEffect(() => {
    handleChange({ target: { value: 0 } });
  }, []);

  return (
    <div className="edit-products">
      <select className="filter" value={selector} onChange={handleChange}>
        <option value={0}>Laptops</option>
        <option value={1}>Sports</option>
        <option value={2}>Video Games</option>
      </select>

      {display.map((product) => (
        <Product
          key={product.product_id}
          path={`../${product.product_name}/${product.product_id}`}
          product={product}
        />
      ))}

      <div className="no-dec">
        <Link to="../new">
          <button className="new-product-button button">Add New Product</button>
        </Link>
      </div>
    </div>
  );
}

export default EditProducts;
