import React, { useContext, useEffect, useState } from "react";
import { CacheContext } from "../App";

function PurchaseHistory(props) {
  const { retrieveFromCache } = useContext(CacheContext);

  const [history, setHistory] = useState([]);
  const cachedHistory = retrieveFromCache("purchaseHistory");

  useEffect(() => {
    if (cachedHistory.length) return setHistory(cachedHistory);
  }, [cachedHistory]);

  return (
    <>
      {history.map(order => (
        <div key={order.order_id}>Order: {JSON.stringify(order)}</div>
      ))}
    </>
  );
}

export default PurchaseHistory;
