import React from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, Row, Col, ListGroup, Image } from "react-bootstrap";
import CheckoutSteps from "../components/CheckoutSteps";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useCreateOrderMutation } from "../slices/ordersApiSlice";
import { clearCartItems } from "../slices/cartSlice";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush" className="bg">
            <ListGroup.Item
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              <h2>משלוח</h2>
              <p>
                <strong>כתובת מגורים: </strong>
                {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              <h2>שיטת משלוח</h2>
              <strong>באמצעות: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>
            <ListGroup.Item
              style={{ backgroundColor: "transparent", color: "white" }}
            >
              <h2>מוצרים בהזמנה:</h2>
              {cart.cartItems.length === 0 ? (
                <Message>העגלה ריקה</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link
                            to={`/products/${item.product}`}
                            style={{ color: "white", fontWeight: "400" }}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col
                          md={4}
                          style={{ color: "white", fontWeight: "300" }}
                        >
                          {item.qty} X ₪{item.price} = ₪{item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col>
          <ListGroup variant="flush" className="rounded-bottom">
            <ListGroup.Item>
              <h2>סיכום הזמנה</h2>
              <ListGroup.Item>
                <Row>
                  <Col>פריטים:</Col>
                  <Col>₪{cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>משלוח:</Col>
                  <Col>₪{cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>מסים:</Col>
                  <Col>₪{cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>סה"כ:</Col>
                  <Col>₪{cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && (
                  <Message variant="danger">{error.data.message}</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems.length === 0}
                  onClick={placeOrderHandler}
                >
                  בצע הזמנה
                </Button>
                {isLoading && <Loader />}
              </ListGroup.Item>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
