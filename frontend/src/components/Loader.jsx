import { Spinner } from "react-bootstrap";

import React from "react";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        color: "white",
        width: "120px",
        height: "120px",
        margin: "auto",
        display: "block",
      }}
    ></Spinner>
  );
};

export default Loader;
