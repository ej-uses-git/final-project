import React from "react";
import { Link } from "react-router-dom";
import { STATIC_URL } from "../utilities/fetchUtils";

function Product(props) {
  const { product, path } = props;
  return (
    <div className="no-dec">
      <Link to={path} key={product.product_id}>
        <div className="product">
          <img
            src={`${STATIC_URL}/images/mainphotos/${product.product_id}.jpg`}
            alt={product.product_name}
            className="order-item-image | fs-200 fw-regular ff-body text-primary-800"
          />
          <h3 className="ff-headings fs-600 fw-bold text-primary-600">
            {product.product_name}
          </h3>
          <p className="ff-body fs-200 fw-bold text-accent-800">
            {product.description}
          </p>
          <p className="ff-headings fs-400 fw-bold text-primary-600">
            ${product.cost.toFixed(2)}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Product;
