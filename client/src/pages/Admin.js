import React from "react";
import { Outlet } from "react-router-dom";

function Admin(props) {
  //TODO: add log out button
  return (
    <div>
      Admin
      <Outlet />
    </div>
  );
}

export default Admin;
