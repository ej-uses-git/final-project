import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { CacheContext } from "../App";
import { postReq, usermanageReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

// /register

function Register(props) {
  const navigate = useNavigate();

  const { writeToCache } = useContext(CacheContext);

  const [page, setPage] = useState(1);

  const firstPageValues = useRef(null);

  const username = useRef();
  const passwordA = useRef();
  const passwordB = useRef();
  const email = useRef();
  const phoneNum = useRef();
  const address = useRef();

  const handlePageOne = useCallback(e => {
    e.preventDefault();
    if (passwordA.current.value !== passwordB.current.value)
      return alert("Please ensure the passwords match."); //TODO: use form validation
    firstPageValues.current = {
      username: username.current.value,
      passwordA: passwordA.current.value,
      passwordB: passwordB.current.value
    };
    setPage(2);
  }, []);

  const goBack = useCallback(() => {
    setPage(1);
  });

  const handlePageTwo = useCallback(async e => {
    e.preventDefault();
    let data, error;

    [data, error] = await usermanageReq("/register/check", {
      username: firstPageValues.current.username,
      email: email.current.value
    });
    if (error) useError(error, navigate);
    if (!data)
      return alert(
        "Information already taken. Try changing your username or email."
      ); //TODO: use form validation

    [data, error] = await usermanageReq("/register", {
      username: firstPageValues.current.username,
      password: firstPageValues.current.passwordA,
      email: email.current.value,
      phoneNumber: phoneNum.current.value,
      address: address.current.value,
      permission: "customer"
    });
    if (error) useError(error, navigate);
    const userId = data;
    localStorage.setItem("currentUser", userId);

    [data, error] = await postReq(`/orders/neworder/${userId}`);
    if (error) useError(error, navigate);
    const cartId = data;

    writeToCache("userInfo", {
      userId,
      username: firstPageValues.current.username,
      email: email.current.value,
      address: address.current.value,
      phoneNum: phoneNum.current.value,
      permission: "customer",
      cartId
    });
    navigate("/users");
  }, []);

  useEffect(() => {
    if (page !== 1 || !firstPageValues.current) return;
    username.current.value = firstPageValues.current.username;
    passwordA.current.value = firstPageValues.current.passwordA;
    passwordB.current.value = firstPageValues.current.passwordB;
    firstPageValues.current = null;
  }, [page]);

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

          <button onClick={goBack}>BACK</button>
          <button type="submit">SIGN UP</button>
        </form>
      )}
      Already signed up? <Link to="/login">Log in here!</Link>
    </div>
  );
}

export default Register;
