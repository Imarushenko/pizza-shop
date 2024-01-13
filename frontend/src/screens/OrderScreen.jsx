import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useMarkOrderAsPaidMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const [markPaid, { isLoading: loadingMarkPaid }] =
    useMarkOrderAsPaidMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("ההזמנה שולמה בהצלחה!");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
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
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("הזמנה סומנה כנשלחה!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const markPaidHandler = async () => {
    try {
      await markPaid(orderId);
      refetch();
      toast.success("הזמנה סומנה כשולמה!");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
              {/* delivered order */}
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
                      סמן הזמנה כנשלחה
                    </Button>
                  </ListGroup.Item>
                )}
              {/* paid order */}
              {loadingMarkPaid && <Loader />}
              {userInfo && userInfo.isAdmin && !order.isPaid && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={markPaidHandler}
                  >
                    סמן הזמנה כשולמה
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
