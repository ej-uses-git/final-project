import React, { useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

function User(props) {
  const navigate = useNavigate();

  const { userId } = useParams();

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
          navigate("/login");
        }}
      >
        Log Out
      </button>
    </div>
  );
}

export default User;
