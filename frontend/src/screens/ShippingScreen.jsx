import React from "react";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, country }));
    navigate("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <FormContainer>
        <h1>Shipping</h1>
        <Form onSubmit={submitHandler}>
          {/* address */}
          <Form.Group controlId="address" className="my-2">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* city */}
          <Form.Group controlId="city" className="my-2">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* country */}
          <Form.Group controlId="country" className="my-2">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type="submit" variant="primary" className="my-2">
            Continue
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ShippingScreen;
