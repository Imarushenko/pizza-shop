import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  // get the year function
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-right text-white">
            <p>Hapisga &copy; {currentYear} </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
