import React from "react";
import { Link } from "react-router-dom";

function Product(props) {
  const { product, path } = props;
  return (
    <Link to={path} key={product.product_id}>
      <img
        src={`http://localhost:8090/images/mainphotos/${product.product_id}.jpg`}
        alt={product.product_name}
      />
      <h3>{product.product_name}</h3>
      <p>{product.description}</p>
      <p>{product.cost}</p>
    </Link>
  );
}

export default Product;
