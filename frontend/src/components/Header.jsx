import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/logo.jpeg";
import { LinkContainer } from "react-router-bootstrap";

const Header = () => {
  return (
    <header className="bg-black">
      <Navbar expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={logo}
                height={100}
                alt="hapisga"
                className="rounded rounded-2xl"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* cart */}
              <LinkContainer to="/cart">
                <Nav.Link className="text-white">
                  <FaShoppingCart />
                  Cart
                </Nav.Link>
              </LinkContainer>
              {/* login */}
              <LinkContainer to="/login">
                <Nav.Link className="text-white">
                  <FaUser />
                  Sign In
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
