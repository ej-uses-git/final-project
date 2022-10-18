import React, { useCallback, useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CacheContext } from "../App";

// /register

function Register(props) {
  const navigate = useNavigate();

  const { writeToCache } = useContext(CacheContext);

  const [page, setPage] = useState(1);

  const username = useRef();
  const passwordA = useRef();
  const passwordB = useRef();
  const email = useRef();
  const phoneNum = useRef();
  const address = useRef();

  const handlePageOne = useCallback(e => {
    e.preventDefault();
    setPage(2);
  }, []);

  const handlePageTwo = useCallback(e => {
    e.preventDefault();
    //TODO: Send CHECK User Existence
    //TODO: Send REGISTER New User
    const userId = 1;
    const permission = "customer"; // || "admin"
    localStorage.setItem("currentUser", userId);
    //TODO: Send POST New Order (if not admin)
    const cartId = 1;
    writeToCache("userInfo", {
      userId,
      username: username.current,
      email: email.current,
      address: address.current,
      phoneNum: phoneNum.current,
      permission,
      cartId
    });
    navigate("/users");
    // if (false /* user is admin */) return navigate(`/users/admin/${userId}`);
    // return navigate(`/users/${userId}`);
  }, []);

  return (
    <div>
      Register
      {page === 1 && (
        <form onSubmit={handlePageOne}>
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
            <label htmlFor="passwordA">Enter your password:</label>
            <input
              required
              type="password"
              name="passwordA"
              id="password-a"
              ref={passwordA}
            />
          </div>

          <div>
            <label htmlFor="passwordB">Confirm your password:</label>
            <input
              required
              type="password"
              name="passwordB"
              id="password-b"
              ref={passwordB}
            />
          </div>

          <button type="submit">NEXT</button>
        </form>
      )}
      {page === 2 && (
        <form onSubmit={handlePageTwo}>
          <div>
            <label htmlFor="email">Enter your email:</label>
            <input required type="email" name="email" id="email" ref={email} />
          </div>

          <div>
            <label htmlFor="phoneNum">Enter your phone number:</label>
            <input
              required
              type="text"
              pattern="123"
              name="phoneNum"
              id="phone-num"
              ref={phoneNum}
            />
          </div>

          <div>
            <label htmlFor="address">Enter your home address:</label>
            <input
              required
              type="text"
              name="address"
              id="address"
              ref={address}
            />
          </div>

          <button type="submit">SIGN UP</button>
        </form>
      )}
    </div>
  );
}

export default Register;
