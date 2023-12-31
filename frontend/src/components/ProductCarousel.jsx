import React from "react";
import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import Loader from "./Loader";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
    <Carousel pause="hover" className="bg-transparent-dark mb-2">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`} className="carousel-link">
            <Image
              src={product.image}
              alt={product.name}
              className="d-block w-100"
              fluid
              style={{ maxHeight: "300px", objectFit: "cover" }}
            />
            <Carousel.Caption className="carousel-caption">
              <div className="caption-content">
                <h5 className="carousel-title">
                  {product.name} (₪{product.price})
                </h5>
                <h5 className="mb-4">{product.description}</h5>
              </div>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
