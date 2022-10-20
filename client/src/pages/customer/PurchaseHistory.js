import React, { useContext, useEffect, useState } from "react";
import { CacheContext } from "../../App";

function PurchaseHistory(props) {
  const { retrieveFromCache } = useContext(CacheContext);

  const [history, setHistory] = useState([]);
  const cachedHistory = retrieveFromCache("purchaseHistory");
  const cachedPayments = retrieveFromCache("paymentMethods");

  useEffect(() => {
    if (cachedHistory.length) return setHistory(cachedHistory);
  }, [cachedHistory]);

  return (
    <div className="items">
      {history.map(order => (
        <div className="item" key={order.order_id}>
          <h2 className="fs-400 ff-headings fw-bold text-neutral-100">
            Order:
          </h2>
          <p className="fs-200 ff-body fw-regular text-primary-800">
            Purchased at {order.purchase_date.slice(11, 16)},{" "}
            {order.purchase_date.slice(0, 10)}
          </p>
          <p className="fs-200 ff-body fw-regular text-primary-800">
            Using the card ending in{" "}
            {cachedPayments.length &&
              cachedPayments
                .find(
                  payment => payment.payment_info_id === order.payment_info_id
                )
                .credit_number.slice(-4)}
          </p>
          <p className="fs-200 ff-body fw-regular text-primary-800">
            Total cost: ${order.total_cost.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

export default PurchaseHistory;
