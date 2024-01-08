import React from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table } from "react-bootstrap";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure delete user?")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="bg-admin rounded">
      <h2>Users</h2>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped bordered hover responsive className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: "green" }} />
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <FaEdit type="button" className="mx-2" />
                  </LinkContainer>
                  <FaTrash
                    type="button"
                    variant="light"
                    className="btn-sm"
                    onClick={() => deleteHandler(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;
