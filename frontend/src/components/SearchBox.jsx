import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      setKeyword("");
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products..."
        className="mr-sm-2 mk-sm-5"
      ></Form.Control>
      <button
        type="submit"
        className="p-2 mx-2 rounded"
        style={{
          padding: "8px 16px",
          margin: "0 8px",
          border: "2px solid #cccccc",
          borderRadius: "8px",
          color: "#28a745",
          backgroundColor: "transparent",
          cursor: "pointer",
          transition:
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out",
        }}
        onMouseOver={(e) => (e.currentTarget.style.borderColor = "#aaaaaa")}
        onMouseOut={(e) => (e.currentTarget.style.borderColor = "#cccccc")}
      >
        Search
      </button>
    </Form>
  );
};

export default SearchBox;
