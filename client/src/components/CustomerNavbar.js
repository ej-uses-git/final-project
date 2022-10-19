import React from "react";
import { NavLink } from "react-router-dom";

function CustomerNavbar(props) {
  return (
    <div>
      <NavLink to="./info">Info</NavLink>
      <NavLink to="./cart">Cart</NavLink>
      <NavLink to="./shop">Shop</NavLink>
      <NavLink to="./orderhistory">Purchase History</NavLink>
      <NavLink to="./payments">Payment Info</NavLink>
    </div>
  );
}

export default CustomerNavbar;
