import React, { useState, useEffect } from "react";
import "./Popular.css";
import Item from "../Item/Item";
const Popular = () => {
  const [data_product, setData_product] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/popularinwomen")
      .then((res) => res.json())
      .then((data) => setData_product(data));
  }, []);
  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN </h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => {
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              old_price={item.old_price}
              new_price={item.new_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
