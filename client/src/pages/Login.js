import React, { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usermanageReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function Login(props) {
  const navigate = useNavigate();

  const username = useRef();
  const password = useRef();

  const handleSubmit = useCallback(async e => {
    e.preventDefault();
    const [data, error] = await usermanageReq("/login", {
      username: username.current.value,
      password: password.current.value //TODO: encrypt
    });
    if (error) useError(error, navigate);
    if (!data) return alert("False info."); //TODO: use form validation
    const userId = data;
    localStorage.setItem("currentUser", userId);
    return navigate(`/users`);
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
      <Link to="/register">Sign Up Here</Link>
    </div>
  );
}

export default Login;
