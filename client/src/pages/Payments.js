import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CacheContext } from "../App";
import { postReq, putReq } from "../utilities/fetchUtils";
import useError from "../utilities/useError";

function Payments(props) {
  const navigate = useNavigate();

  const { retrieveFromCache, writeToCache } = useContext(CacheContext);

  const { userId } = useParams();

  const [payments, setPayments] = useState([]);
  const [adding, setAdding] = useState(false);

  const originalPayments = useRef();
  const submitted = useRef();

  const creditCard = useRef();
  const expDate = useRef();
  const cvv = useRef();

  const cachedPayments = retrieveFromCache("paymentMethods");

  const handleNewPayment = useCallback(async e => {
    e.preventDefault();
    const [data, error] = await postReq(`/users/${userId}/pay`, {
      creditNum: creditCard.current.value,
      cvv: cvv.current.value,
      expDate: expDate.current.value + "-00"
    });
    if (error) return useError(error, navigate);
    const newPayment = {
      credit_number: creditCard.current.value,
      cvv: cvv.current.value,
      expDate: expDate.current.value + "-00",
      user_id: userId,
      active: true,
      payment_info_id: data
    };
    setPayments(prev => {
      let copy = [...prev].map(item => ({ ...item, active: 0 }));
      copy = [...copy, newPayment];
      return copy;
    });
    submitted.current = true;
    e.target.reset();
    setAdding(false);
  }, []);

  const saveChanges = useCallback(async () => {
    const activeIndex = payments.findIndex(item => !!item.active);
    if (
      activeIndex ===
        originalPayments.current.findIndex(item => !!item.active) ||
      activeIndex < 0
    )
      return;

    const [, error] = await putReq(`/users/${userId}/activepay`, {
      id: payments[activeIndex].payment_info_id
    });
    if (error) return useError(error, navigate);
  }, [payments]);

  useEffect(() => {
    if (!submitted.current) return;
    originalPayments.current = payments;
    writeToCache("paymentMethods", payments);
    submitted.current = false;
  }, [payments]);

  useEffect(() => {
    if (!cachedPayments.length) return;
    originalPayments.current = cachedPayments;
    setPayments(cachedPayments);
  }, [cachedPayments]);

  return (
    <div className="def-form flex-col">
      {payments.map((payment, i) => (
        <div
          className="container container--small"
          key={payment.payment_info_id}
        >
          <h4 className="fs-400 ff-headings fw-bold text-primary-600">
            Payment:
          </h4>{" "}
          <p className="fs-200 ff-headings fw-regular text-primary-600">
            {"************" + payment.credit_number.slice(-4)}
          </p>{" "}
          <input
            type="checkbox"
            name="active"
            id="active"
            onChange={() => {
              setPayments(prev => {
                let copy = [...prev].map(item => ({ ...item, active: 0 }));
                copy[i].active = 1;
                return copy;
              });
            }}
            checked={payment.active}
          />
        </div>
      ))}

      <button className="new-product-button button" onClick={saveChanges}>
        Save Changes
      </button>

      <button className="button" onClick={() => setAdding(prev => !prev)}>
        {adding ? "Cancel" : "Add"} New Payment
      </button>
      {adding && (
        <form className="def-form flex-col" onSubmit={handleNewPayment}>
          <div className="container">
            <label
              className="ff-headings fs-200 fw-bold text-primary-600"
              htmlFor="credit-card"
            >
              Enter your credit card number:
            </label>
            <input
              required
              type="text"
              name="creditCard"
              id="credit-card"
              maxLength={16}
              minLength={16}
              ref={creditCard}
            />
          </div>

          <div className="container">
            <label
              className="ff-headings fs-200 fw-bold text-primary-600"
              htmlFor="exp-date"
            >
              Enter the expiry date:
            </label>
            <input
              required
              type="month"
              name="expDate"
              id="exp-date"
              ref={expDate}
            />
          </div>

          <div className="container">
            <label
              className="ff-headings fs-200 fw-bold text-primary-600"
              htmlFor="c-v-v"
            >
              Enter the CVV:
            </label>
            <input
              required
              type="text"
              name="cvv"
              id="c-v-v"
              maxLength={3}
              minLength={3}
              ref={cvv}
            />
          </div>

          <button className="button" type="submit">
            ADD
          </button>
        </form>
      )}
    </div>
  );
}

export default Payments;
