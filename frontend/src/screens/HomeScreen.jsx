import { Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn">
          חזור
        </Link>
      )}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          {/* the title of the page component */}
          <Meta title="Hapisga - Sambusk" />
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
};

export default HomeScreen;

// // frontend/homepagescreen.js
// import React from "react";
// import { Col, Row } from "react-bootstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { setCategory } from "../slices/categorySlice";
// import Product from "../components/Product";
// import { useGetProductsQuery } from "../slices/productsApiSlice";
// import Loader from "../components/Loader";
// import Message from "../components/Message";

// const HomeScreen = () => {
//   const { data: products, isLoading, error } = useGetProductsQuery();
//   const dispatch = useDispatch();
//   const selectedCategory = useSelector((state) => state.category);

//   const handleCategoryChange = (category) => {
//     dispatch(setCategory(category));
//   };

//   return (
//     <>
//       {/* Add category tabs */}
//       <div className="category-tabs">
//         {["Pizza", "Salad", "Sambusak", "Specials"].map((category) => (
//           <div
//             key={category}
//             className={`category-tab ${
//               selectedCategory.toLowerCase() === category.toLowerCase()
//                 ? "active"
//                 : ""
//             }`}
//             onClick={() => handleCategoryChange(category)}
//           >
//             {category}
//           </div>
//         ))}
//       </div>

//       {isLoading ? (
//         <Loader />
//       ) : error ? (
//         <Message variant="danger">
//           {error?.data?.message || error.error}
//         </Message>
//       ) : (
//         <>
//           <Row>
//             {products
//               .filter(
//                 (product) =>
//                   product.category.toLowerCase() ===
//                   selectedCategory.toLowerCase()
//               )
//               .map((product) => (
//                 <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
//                   <Product product={product} />
//                 </Col>
//               ))}
//           </Row>
//         </>
//       )}
//     </>
//   );
// };

// export default HomeScreen;
