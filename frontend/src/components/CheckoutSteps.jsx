import React from "react";
import { Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <Nav className="justify-content-center rounded-top" style={{backgroundColor:'#85929E' }}>
      <Nav.Item>
        {step1 ? (
          <LinkContainer to="/login" style={{color: 'white'}}>
            <Nav.Link>התחבר</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>הרשמה</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step2 ? (
          <LinkContainer to="/shipping" style={{color: 'white'}}>
            <Nav.Link>משלוח</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>משלוח</Nav.Link>
        )}
      </Nav.Item>

      <Nav.Item>
        {step3 ? (
          <LinkContainer to="/payment" style={{color: 'white'}}>
            <Nav.Link>תשלום</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>תשלום</Nav.Link>
        )}
      </Nav.Item>
      <Nav.Item>
        {step4 ? (
          <LinkContainer to="/placeorder" style={{color: 'white'}}>
            <Nav.Link>ביצוע הזמנה</Nav.Link>
          </LinkContainer>
        ) : (
          <Nav.Link disabled>ביצוע הזמנה</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutSteps;
