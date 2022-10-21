import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Landing(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!storedUser) return navigate("/login");
    navigate("/users");
  }, [navigate]);

  return <></>;
}

export default Landing;
