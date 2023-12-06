import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Card className="my-3 p-3 rounded card">
      <Link to={`/product/${product._id}`}>
        <Card.Img
          src={product.image}
          style={{ height: "200px", objectFit: "cover" }}
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`} className="link">
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numOfReviews} Reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">₪{product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
