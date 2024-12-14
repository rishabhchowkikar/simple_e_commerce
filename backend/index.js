const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");

app.use(express.json());
app.use(cors());

// Database Connection with MongoDB
mongoose.connect(
  `mongodb+srv://rishabh02chowkikar:97teRyBqc6YvTMrq@cluster0.4hedi.mongodb.net/`
);

// API Creation

app.get("/", (req, res) => {
  res.send("expresss app is running");
});

// Image Storage engine

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({ storage: storage });

//Creating Upload endpoint from image

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for creating products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avilable: {
    type: Boolean,
    default: true,
  },
});

app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for deleteing products
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({
    id: req.body.id,
  });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating api for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("all products fetched");
  res.send(products);
});

// creating user schema
const UserSchema = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

// Creating end point for registering the user
app.post("/signup", async (req, res) => {
  let check = await UserSchema.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      error: "Existing User found with same Email Address",
    });
  }

  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new UserSchema({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: { id: user.id },
  };

  const token = jwt.sign(data, "secret_ecom");
  res.json({
    success: true,
    token: token,
  });
});

// creating end point for user login

app.post("/login", async (req, res) => {
  let user = await UserSchema.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        errors: "Wrong Password",
      });
    }
  } else {
    res.json({
      success: false,
      errors: "No User found, or Wrong Email",
    });
  }
});

// creating end point for new Collection data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newCollection = products.slice(1).slice(-8);
  console.log("New collection Fetched");
  res.send(newCollection);
});

// creating popular end point for women section
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({
    category: "women",
  });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women array fetched");
  res.send(popular_in_women);
});

// creating middleware to fetch user
const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (err) {
      res.status(401).send({ errors: "Please authenticate using valid token" });
    }
  }
};

// creating endpoint for adding product in cart
app.post("/addtocart", fetchuser, async (req, res) => {
  console.log("Added", req.body.itemId);
  let userData = await UserSchema.findOne({ _id: req.user.id });
  if (!userData.cartData[req.body.itemId]) {
    userData.cartData[req.body.itemId] = 0;
  }
  userData.cartData[req.body.itemId]++;
  const updatedUser = await UserSchema.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData },
    { new: true }
  );
  console.log(req.body, req.user);
  res.send("Added");
});

// creating endpoint to remove product from cart data
app.post("/removefromcart", fetchuser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await UserSchema.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await UserSchema.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

// creating end point to get cartdata
app.post("/getcart", fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await UserSchema.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on port " + port);
  } else {
    console.log("error" + error);
  }
});
