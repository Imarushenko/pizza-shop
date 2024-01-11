import React from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button } from "react-bootstrap";
import Message from "../components/Message";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Loader from "../components/Loader";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "NIS",
            components: "buttons,paylater",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success("Payment Successful");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order delivered!");
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h4
        className="text-white justify-content-center rounded-top p-1"
        style={{ backgroundColor: "#85929E", marginTop: 0, marginBottom: 0 }}
      >
        מספר הזמנה: {order._id}
      </h4>
      <Row>
        <Col md={8}>
          <ListGroup>
            <ListGroup.Item>
              <h2>משלוח</h2>
              <p>
                <strong>שם:</strong> {order.user.name}
              </p>
              <p>
                <strong>כתובת מייל:</strong> {order.user.email}
              </p>
              <p>
                <strong>כתובת מגורים:</strong> {order.shippingAddress.address},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">נשלח ב {order.deliveredAt}</Message>
              ) : (
                <Message variant="danger">לא נשלח</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>שיטת משלוח</h2>
              <p>
                <strong>באמצעות:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">שולם ב {order.paidAt}</Message>
              ) : (
                <Message variant="danger">לא שולם</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>פריטים בהזמנה</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={1}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4}>
                      {item.qty} X ₪{item.price} = ₪{item.qty * item.price}
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item>
              <h2>סיכום הזמנה</h2>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>פריטים</Col>
                <Col>₪{order.itemsPrice}</Col>
              </Row>
              <Row>
                <Col>משלוח</Col>
                <Col>₪{order.shippingPrice}</Col>
              </Row>
              <Row>
                <Col>מסים</Col>
                <Col>₪{order.taxPrice}</Col>
              </Row>
              <Row>
                <Col>סה"כ</Col>
                <Col>₪{order.totalPrice}</Col>
              </Row>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverOrderHandler}
                    >
                      סמן כנשלח
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
