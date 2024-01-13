import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { ListGroup, Col, Row, Image, Button, Form } from "react-bootstrap";
import Rating from "../components/Rating";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review Submitted");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-3 rounded" style={{ backgroundColor: "#EAEDED" }}>
      <Link className="btn my-3" to="/">
        חזור
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {/* the title of the page component */}
          <Meta title={product.name} />
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
                    text={`${product.numOfReviews} ביקורות`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>מחיר: ₪{product.price}</ListGroup.Item>
                <ListGroup.Item>
                  {product.countInStock > 1
                    ? "זמין בחנות"
                    : "המוצר זמנית לא זמין בחנות"}
                </ListGroup.Item>
                <ListGroup.Item>{product.description}</ListGroup.Item>
              </ListGroup>
              {product.countInStock > 0 && (
                <ListGroup.Item className="mt-2">
                  <Row>
                    <Col className="text-white">כמות:</Col>
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
                  disabled={product.countInStock < 1}
                  onClick={addToCartHandler}
                >
                  הוסף לעגלה
                </Button>
              </ListGroup.Item>
            </Col>
          </Row>

          <Row className="review">
            <Col md={5}>
              {product.reviews.length === 0 && <></>}
              <ListGroup variant="flush" className="rounded">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}

                <ListGroup.Item>
                  <h2>כתבו ביקורת על המוצר</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>רייטינג</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">בחר . . . </option>
                          <option value="1">1 - גרוע</option>
                          <option value="2">2 - טעון שיפור</option>
                          <option value="3">3 - טוב</option>
                          <option value="4">4 - טוב מאוד</option>
                          <option value="5">5 - מצויין</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>תיאור</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        הוסף
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      בבקשה <Link to="/login">התחבר\י</Link> על מנת להוסיף
                      ביקורת
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
