import React from "react";
import { Outlet } from "react-router-dom";

function LoggedIn(props) {
  return (
    <div>
      Logged In
      <Outlet />
    </div>
  );
}

export default LoggedIn;
