import React, { useContext, useEffect, useState } from "react";
import { CacheContext } from "../App";

function Cart(props) {
  //TODO: display cart from GET Cart For User

  const { retrieveFromCache } = useContext(CacheContext);

  const [cart, setCart] = useState([]);
  const cachedCart = retrieveFromCache("userCart");

  useEffect(() => {
    if (cachedCart.length) return setCart(cachedCart);
  }, [cachedCart]);

  return (
    <>
      {cart.map(item => (
        <div key={item.item_id}>Item: {JSON.stringify(item)}</div>
      ))}
    </>
  );
}

export default Cart;
