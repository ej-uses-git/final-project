import React from "react";
import { Outlet } from "react-router-dom";

function Admin(props) {
  return (
    <div>
      Admin
      <Outlet />
    </div>
  );
}

export default Admin;
