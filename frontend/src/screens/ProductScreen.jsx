import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ListGroup, Col, Row, Image, Button } from "react-bootstrap";
import Rating from "../components/Rating";

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const { id: productId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      setProduct(data);
    };
    fetchProduct();
  }, [productId]);

  return (
    <>
      <Link className="btn my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={5}>
          <Image src={product.image} alt={product.name} fluid className="rounded" />
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
            <ListGroup.Item>Price: {product.price}</ListGroup.Item>
            <ListGroup.Item>
              {product.isInStock === true
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
              disabled={product.isInStock === false}
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
