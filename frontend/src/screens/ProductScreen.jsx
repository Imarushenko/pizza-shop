import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ListGroup, Col, Row, Image, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  return (
    <>
      <Link className="btn my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image
              src={product.image}
              alt={product.name}
              fluid
              className="rounded"
            />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush" className="rounded">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating
                  value={product.rating}
                  text={`${product.numOfReviews} Reviews`}
                />
              </ListGroup.Item>
              <ListGroup.Item>Price: ₪{product.price}</ListGroup.Item>
              <ListGroup.Item>
                {product.isInStock === true
                  ? "Available"
                  : "Temporary Not Available"}
              </ListGroup.Item>
              <ListGroup.Item>{product.description}</ListGroup.Item>
            </ListGroup>
            {product.isInStock === true && (
              <ListGroup.Item className="mt-2">
                <Row>
                  <Col>Qty:</Col>
                </Row>
                <Row className="mt-1" style={{ width: "70px" }}>
                  <Col>
                    <Form.Control
                      as="select"
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                    >
                      {[...Array(product.countInStock).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
              </ListGroup.Item>
            )}
          </Col>
          <Col md={3}>
            <ListGroup.Item>
              <Button
                className="btn"
                type="button"
                disabled={product.isInStock === false}
                onClick={addToCartHandler}
              >
                Add To Cart
              </Button>
            </ListGroup.Item>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
