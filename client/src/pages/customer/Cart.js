import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { CacheContext } from "../../App";
import OrderItem from "../../components/OrderItem";
import { postReq, putReq } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function Cart(props) {
  const navigate = useNavigate();

  const { retrieveFromCache, writeToCache } = useContext(CacheContext);

  const cachedCart = retrieveFromCache("userCart");
  const cachedPayments = retrieveFromCache("paymentMethods");
  const purchaseHistory = retrieveFromCache("purchaseHistory");
  const userInfo = retrieveFromCache("userInfo");

  const originalCart = useRef({});

  const [cart, setCart] = useState([]);

  const totalCost = cart.reduce(
    (acc, cur) => acc + (cur.cost || 0) * cur.amount,
    0
  );

  const saveChanges = useCallback(async () => {
    const unsavedChanges = cart.filter(
      (item, i) => item.amount !== originalCart.current[i].amount
    );
    if (!unsavedChanges.length) return;
    for (let item of unsavedChanges) {
      if (item.amount === 0)
        setCart((prev) => {
          const copy = [...prev];
          delete copy[copy.indexOf(item)];
          return copy;
        });
      const [, error] = await putReq(
        `/orders/${userInfo.order_id}/items/${item.item_id}`,
        {
          amount: item.amount,
        }
      );
      if (error) return handleError(error, navigate);
    }
  }, [cart, navigate, originalCart, userInfo.order_id]);

  const fulfillCart = useCallback(async () => {
    if (!cart.length) return;

    let activePayment = cachedPayments.find((payment) => !!payment.active);
    if (!activePayment) {
      alert("Please configure your payment information.");
      return navigate("../payments");
    }
    activePayment = activePayment.payment_info_id;

    let data, error;
    [data, error] = await putReq(`/orders/${userInfo.order_id}`, {
      totalCost,
      paymentInfoId: activePayment,
    });
    if (error) return handleError(error, navigate);
    writeToCache("purchaseHistory", [...purchaseHistory, data[0]]);

    [data, error] = await postReq(`/orders/neworder/${userInfo.user_id}`);
    if (error) return handleError(error, navigate);

    writeToCache("userCart", []);
    writeToCache("userInfo", { ...userInfo, order_id: data });
    setCart([]);
  }, [
    cachedPayments,
    navigate,
    totalCost,
    userInfo,
    purchaseHistory,
    cart.length,
    writeToCache,
  ]);

  useEffect(() => {
    if (cachedCart.length) {
      originalCart.current = cachedCart;
      setCart(cachedCart);
    }
  }, [cachedCart, purchaseHistory]);

  return (
    <div className="user-cart | bg-accent-500">
      {cart.map((item, i) => (
        <OrderItem
          key={item.item_id}
          item={item}
          onClick={() => {
            if (item.amount > 0) {
              setCart((prev) => {
                const copy = [...prev].map((item) => ({ ...item }));
                copy[i].amount--;
                return copy;
              });
            }
          }}
        />
      ))}
      <h2 className="ff-headings fw-bold fs-200 text-neutral-100">
        Total cost: ${totalCost.toFixed(2)}
      </h2>
      <div className="container container--small">
        <button className="button" onClick={saveChanges}>
          Save Changes
        </button>
        <button className="button" onClick={fulfillCart}>
          Purchase Cart
        </button>
      </div>
    </div>
  );
}

export default Cart;
