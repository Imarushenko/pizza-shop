import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Hapisga Sambusk",
  description: "Sambusk & Pizza since 2009 ",
  keywords: "local food, sambusk, pizza, salad, specials",
};

export default Meta;
