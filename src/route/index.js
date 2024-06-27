const express = require("express");
const authRoute = require("./authRoute");
const courseRoute = require("./courseRoute");
const paymentRoute = require("./paymentRoute");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/course",
    route: courseRoute,
  },
  {
    path: "/pay",
    route: paymentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
