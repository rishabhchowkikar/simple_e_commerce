import React from "react";
import "./NewsLetter.css";
const NewsLetter = () => {
  return (
    <div className="newsletter">
      <h1>Get Exclusive offers On Your Email</h1>
      <p>Subscibe to our News-Letter and stay Updated</p>
      <div>
        <input type="email" placeholder="Enter Email" />
        <button>Subscribe</button>
      </div>
    </div>
  );
};

export default NewsLetter;
