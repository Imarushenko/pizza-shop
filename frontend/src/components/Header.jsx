import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import logo from "../assets/newlogo.jpeg";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";
import SearchBox from "./SearchBox";
import { resetCart } from "../slices/cartSlice";

const Header = () => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollThreshold = 50;

      setIsScrolledDown(scrollTop > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const headerClass = isScrolledDown ? "sticky-top scrolled" : "sticky-top";

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar
        expand="md"
        collapseOnSelect
        className={`${headerClass} custom-navbar`}
        style={{ direction: "ltr" }}
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img
                src={logo}
                height={135}
                alt="hapisga"
                className="rounded rounded-2xl"
              />
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {/* search box */}
              <SearchBox />
              {/* cart */}
              <LinkContainer to="/cart">
                <Nav.Link className="nav-link-text">
                  <FaShoppingCart />
                  עגלה{" "}
                  {cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cartItems.reduce((acc, cur) => acc + cur.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {/* user info, login, logout */}
              {userInfo ? (
                <NavDropdown
                  title={
                    <span style={{ color: "white" }}>{userInfo.name}</span>
                  }
                  id="username"
                  className="nav-link-text"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>פרופיל</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    התנתקות
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link className="nav-link-text">
                    <FaUser />
                    התחברות
                  </Nav.Link>
                </LinkContainer>
              )}
              {/* admin */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown
                  title={<span style={{ color: "white" }}>מנהל</span>}
                  id="adminmenu"
                  className="nav-link-text"
                >
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>מוצרים</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>משתמשים</NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>הזמנות</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
