import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { CacheContext } from "../App";

function User(props) {
  const navigate = useNavigate();

  const { userId } = useParams();

  const { clearCache } = useContext(CacheContext);

  const storedUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!storedUser || storedUser !== parseInt(userId))
      return navigate("/error/not logged in");
  }, [userId, storedUser]);

  return (
    <div>
      User
      <Outlet />
      <button
        onClick={() => {
          localStorage.removeItem("currentUser");
          clearCache();
          navigate("/login");
        }}
      >
        Log Out
      </button>
    </div>
  );
}

export default User;
