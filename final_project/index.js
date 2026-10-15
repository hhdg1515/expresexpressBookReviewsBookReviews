
const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();
const PORT = 5000;

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/customer/auth", (req, res, next) => {
  const token = req.session.authorization?.accessToken;

  if (!token) {
    return res.status(401).json({
      message: "Please log in first",
    });
  }

  try {
    req.user = jwt.verify(token, "access");
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
