import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrdersQuery } from "../slices/ordersApiSlice";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="bg-admin rounded">
      <h2>הזמנות</h2>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>משתמש</th>
              <th>תאריך</th>
              <th>סה"כ</th>
              <th>שולם?</th>
              <th>נשלח?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <h6 type="button" variant="light" className="btn-sm">
                      פרטים
                    </h6>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default OrderListScreen;
