import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Item from "../components/Item";
import { getReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function ProductDetails(props) {
  //TODO: enable adding an item to cart

  const navigate = useNavigate();

  const { productId } = useParams();

  const localCache = useRef([]);

  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const cachedItems = localCache.current;
    if (cachedItems.length) return setDisplay(cachedItems);

    (async () => {
      const [data, error] = await getReq(`/products/${productId}/items`);
      if (error) return useError(error, navigate);
      setDisplay(data);
      localCache.current = data;
    })();
  }, []);

  return (
    <>
      {display.map(item => (
        <Item
          key={item.item_id}
          itemId={item.item_id}
          color={item.item_color}
        />
      ))}
    </>
  );
}

export default ProductDetails;
