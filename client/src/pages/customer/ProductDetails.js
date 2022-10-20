import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Item from "../../components/Item";
import { CacheContext } from "../../App";
import { getReq, postReq } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

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
        amount,
      });
      if (error) return handleError(error, navigate);
      if (!data) return alert("Not enough items in stock.");
      const cachedCart = retrieveFromCache("userCart");
      if (data.amount) {
        const copy = [...cachedCart];
        const changedIndex = copy.findIndex((item) => item.item_id === itemId);
        const oldAmount = copy[changedIndex].amount;
        copy[changedIndex] = {
          ...copy[changedIndex],
          amount: oldAmount + parseFloat(data.amount),
        };
        return writeToCache("userCart", copy);
      }
      const itemData = display.find((item) => item.item_id === itemId);
      writeToCache("userCart", [
        ...cachedCart,
        {
          amount,
          product_name: productName,
          item_id: itemId,
          item_color: itemData.item_color,
          item_amount: itemData.item_amount,
          product_id: productId,
          cost: itemData.cost,
          photos: itemData.photos,
        },
      ]);
    },
    [display, navigate, productId, productName, retrieveFromCache, writeToCache]
  );

  useEffect(() => {
    const cachedItems = localCache.current;
    if (cachedItems.length) return setDisplay(cachedItems);

    (async () => {
      const [data, error] = await getReq(`/products/${productId}/items`);
      if (error) return handleError(error, navigate);
      setDisplay(data);
      localCache.current = data;
    })();
  }, [navigate, productId]);

  return (
    <div className="product-details">
      {display.map((item) =>
        item.item_amount ? (
          <Item
            key={item.item_id}
            itemId={item.item_id}
            color={item.item_color}
            cost={item.cost}
            addToCart={(amount) => addToCart(item.item_id, amount)}
            productName={item.product_name}
            itemAmount={item.item_amount}
          />
        ) : (
          ""
        )
      )}

      <div className="no-dec">
        <Link to="../../shop">
          <button className="back-button button">Back To Products</button>
        </Link>
      </div>
    </div>
  );
}

export default ProductDetails;
