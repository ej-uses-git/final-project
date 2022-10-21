import React, { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usermanageReq } from "../../utilities/fetchUtils";
import handleError from "../../utilities/handleError";

function Login(props) {
  const navigate = useNavigate();

  const username = useRef();
  const password = useRef();

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const [data, error] = await usermanageReq("/login", {
        username: username.current.value,
        password: password.current.value,
      });
      if (error) return handleError(error, navigate);
      if (!data) {
        username.current.setCustomValidity("False info.");
        setTimeout(() => {
          e.target.requestSubmit();
        }, 1);
        return;
      }
      const userId = data;
      localStorage.setItem("currentUser", userId);
      return navigate(`/users`);
    },
    [navigate]
  );

  return (
    <div className="login-page flex-col">
      <h2 className="ff-headings fs-600 fw-bold text-primary-600">Log In</h2>
      <form className="login-form | def-form flex-col" onSubmit={handleSubmit}>
        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="username"
          >
            Enter your username:
          </label>
          <input
            required
            onChange={() => username.current.setCustomValidity("")}
            type="text"
            name="username"
            id="username"
            ref={username}
          />
        </div>

        <div className="container">
          <label
            className="ff-headings fs-400 fw-bold text-primary-600"
            htmlFor="password"
          >
            Enter your password:
          </label>
          <input
            required
            onChange={() => username.current.setCustomValidity("")}
            type="password"
            name="password"
            id="password"
            ref={password}
          />
        </div>

        <button className="button" type="submit">
          Log In
        </button>
      </form>
      <Link to="/register" className="fs-200 ff-body fw-bold text-primary-600">
        Sign Up Here
      </Link>
    </div>
  );
}

export default Login;
