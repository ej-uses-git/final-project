import React from "react";
import { Link, useParams } from "react-router-dom";

function Error(props) {
  const { errorMessage } = useParams();

  return (
    <div>
      Error: {errorMessage.toUpperCase()}
      <Link to="/login">To Login</Link>
    </div>
  );
}

export default Error;
