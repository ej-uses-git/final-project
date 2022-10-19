import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Item from "../components/Item";
import { CacheContext } from "../App";
import { getReq, postReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function ProductDetails(props) {
  const navigate = useNavigate();

  const { retrieveFromCache, writeToCache } = useContext(CacheContext);

  const { productId, productName } = useParams();

  const localCache = useRef([]);

  const [display, setDisplay] = useState([]);

  const addToCart = useCallback(
    async (itemId, amount) => {
      const { order_id } = retrieveFromCache("userInfo");
      const [data, error] = await postReq(`/orders/${order_id}/items`, {
        itemId,
        amount
      });
      if (error) return useError(error, navigate);
      if (!data) return alert("Not enough items in stock.");
      const cachedCart = retrieveFromCache("userCart");
      const itemData = display.find(item => item.item_id === itemId);
      console.log("\n== display ==\n", display, "\n");
      writeToCache("userCart", [
        ...cachedCart,
        {
          amount,
          product_name: productName,
          item_id: itemId,
          item_color: itemData.item_color,
          item_amount: itemData.item_amount,
          product_id: productId,
          photos: itemData.photos
        }
      ]);
      e.target.reset();
    },
    [display, retrieveFromCache]
  );

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
          addToCart={amount => addToCart(item.item_id, amount)}
          itemAmount={item.item_amount}
        />
      ))}

      <Link to="../../shop">
        <button>Back To Products</button>
      </Link>
    </>
  );
}

export default ProductDetails;
