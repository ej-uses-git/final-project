import React, { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const navigate = useNavigate();

  const username = useRef();
  const password = useRef();

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    // TODO: Send CHECK Login Info
    const userId = 1; //!
    if (false /* user is admin */) return navigate(`/users/admin/${userId}`);
    return navigate(`/users/${userId}`);
  }, []);

  return (
    <div>
      Log In
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Enter your username:</label>
          <input
            required
            type="text"
            name="username"
            id="username"
            ref={username}
          />
        </div>

        <div>
          <label htmlFor="password">Enter your password:</label>
          <input
            required
            type="password"
            name="password"
            id="password"
            ref={password}
          />
        </div>

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
