import React from "react";
import { NavLink } from "react-router-dom";

function AdminNavbar(props) {
  //TODO: Add all options
  return (
    <div>
      <NavLink to="./info">Info</NavLink>
      <NavLink to="./products/new">New Product</NavLink>
      <NavLink to="./products/edit">Edit Products</NavLink>
    </div>
  );
}

export default AdminNavbar;
