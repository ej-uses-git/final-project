import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Landing(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.stringify(localStorage.getItem("currentUser"));
    if (!storedUser) return navigate("/login");
    navigate("/users");
  }, []);

  return <>Landing</>;
}

export default Landing;
