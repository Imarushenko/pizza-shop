import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Footer = () => {
  // get the year function
  const currentYear = new Date().getFullYear();
  return (
    <footer style={{ background: "rgba(0, 0, 0, 0.7)" }}>
      <Container>
        <Row>
          <Col className="text-center text-white">
            <p className="mt-3">Hapisga &copy; {currentYear} </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
