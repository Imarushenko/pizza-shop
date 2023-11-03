import React from "react";
import { Link, useParams } from "react-router-dom";
import products from "../products";
import { ListGroup, Col, Row, Image, Button } from "react-bootstrap";
import Rating from "../components/Rating";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const product = products.find((p) => p._id === productId);
  return (
    <>
      <Link className="btn my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating
                value={product.rating}
                text={`${product.numReviews} Reviews`}
              />
            </ListGroup.Item>
            <ListGroup.Item>Price: {product.price}</ListGroup.Item>
            <ListGroup.Item>
              {product.countInStock === true
                ? "Available"
                : "Temporary Not Available"}
            </ListGroup.Item>
            <ListGroup.Item>{product.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <ListGroup.Item>
            <Button
              className="btn"
              type="button"
              disabled={product.countInStock === false}
            >
              Add To Cart
            </Button>
          </ListGroup.Item>
        </Col>
      </Row>
    </>
  );
};

export default ProductScreen;
