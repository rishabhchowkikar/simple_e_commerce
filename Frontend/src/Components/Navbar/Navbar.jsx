import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/Frontend_Assets/logo.png";
import nav_dropdown from "../Assets/Frontend_Assets/nav_dropdown.png";
import cart_icon from "../Assets/Frontend_Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>SHOPPER</p>
      </div>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={nav_dropdown}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
              outline: "none",
            }}
            to="/"
          >
            Shop
          </Link>
          {menu === "shop" ? <hr /> : ""}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
              outline: "none",
            }}
            to="/mens"
          >
            Men
          </Link>{" "}
          {menu === "mens" ? <hr /> : ""}
        </li>
        <li onClick={() => setMenu("women")}>
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
              outline: "none",
            }}
            to="/womens"
          >
            Women
          </Link>{" "}
          {menu === "women" ? <hr /> : ""}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link
            style={{
              textDecoration: "none",
              color: "inherit",
              outline: "none",
            }}
            to="/kids"
          >
            Kids
          </Link>{" "}
          {menu === "kids" ? <hr /> : ""}
        </li>
      </ul>
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link style={{ textDecoration: "none" }} to="/login">
            <button>Login</button>
          </Link>
        )}

        <Link style={{ textDecoration: "none" }} to="/cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
