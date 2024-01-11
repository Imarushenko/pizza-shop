import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { Row, Col, ListGroup, Image, Form, Button } from "react-bootstrap";
// import Message from "../components/Message";
import { addToCart, removeFromCart } from "../slices/cartSlice";
import emptyCartImage from "../assets/emptyCart.png";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  // add to cart
  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  // remove from cart
  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  // checkout
  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  return (
    <Row>
      <Col md={8}>
        {cartItems.length === 0 ? (
          <Row>
            <Col md={10} className="position-relative">
              <div
                style={{
                  position: "relative",
                  width: "500px",
                  backgroundColor: "#FFFBE9",
                }}
              >
                <Image
                  src={emptyCartImage}
                  style={{ width: "100%", height: "100%" }}
                />
                {!userInfo ? (
                  <div className="position-absolute bottom-0 end-0 p-2">
                    <span className="me-2">ברוכים הבאים!</span>
                    <Link to="/login" className="text-decoration-none me-2">
                      התחברות
                    </Link>
                    <span>/</span>
                    <Link to="/register" className="text-decoration-none ms-2">
                      הרשמה
                    </Link>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Col>
          </Row>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item
                key={item._id}
                style={{ backgroundColor: "transparent" }}
              >
                <Row className="rounded p-1 bg" as="card">
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link className="link" to={`/product/${item._id}`}>
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>₪{item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <FaTrash
                      type="button"
                      onClick={() => removeFromCartHandler(item._id)}
                    />
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <div className="p-2">
          <ListGroup variant="flush" className="rounded border border-dark">
            <ListGroup.Item>
              <h2>
                סה"כ ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                מוצרים
              </h2>
              ₪
              {cartItems
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                המשך לתשלום
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </div>
      </Col>
    </Row>
  );
};

export default CartScreen;
