import React, { useContext, useEffect, useState } from "react";
import { CacheContext } from "../App";

function PurchaseHistory(props) {
  const { retrieveFromCache } = useContext(CacheContext);

  const [history, setHistory] = useState([]);
  const cachedHistory = retrieveFromCache("purchaseHistory");
  const cachedPayments = retrieveFromCache("paymentMethods");

  useEffect(() => {
    if (cachedHistory.length) return setHistory(cachedHistory);
  }, [cachedHistory]);

  return (
    <>
      {history.map(order => (
        <div key={order.order_id}>
          Order:
          <p>
            Purchased at {order.purchase_date.slice(11, 16)},{" "}
            {order.purchase_date.slice(0, 10)}
          </p>
          <p>
            Using the card ending in{" "}
            {cachedPayments.length &&
              cachedPayments
                .find(
                  payment => payment.payment_info_id === order.payment_info_id
                )
                .credit_number.slice(-4)}
          </p>
          <p>Total cost: ${order.total_cost.toFixed(2)}</p>
        </div>
      ))}
    </>
  );
}

export default PurchaseHistory;
