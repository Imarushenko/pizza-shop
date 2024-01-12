import React from "react";
import { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { savePaymentMethod } from "../slices/cartSlice";

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  // useEffect(() => {
  //   setPaymentMethod("PayLater");
  // }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h1>שיטת תשלום</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            {/* <Col>
              <Form.Check
                type="radio"
                className="my-2"
                label="תשלום במקום\לשליח"
                id="PayLater"
                name="paymentMethod"
                value="PayLater"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col> */}
            <Col>
              <Form.Check
                type="radio"
                className="my-2"
                label="PayPal או אשראי"
                id="PayPal"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              ></Form.Check>
            </Col>
          </Form.Group>
          <Button type="submit" variant="primary">
            המשך
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default PaymentScreen;
