import { Link, useParams } from "react-router-dom";
import { ListGroup, Col, Row, Image, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = () => {
  const { id: productId } = useParams();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

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
      )}
    </>
  );
};

export default ProductScreen;
