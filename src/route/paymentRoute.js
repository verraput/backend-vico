const express = require("express");
const PaymentController = require("../controllers/PaymentController");

const router = express.Router();
const auth = require("../middlewares/auth");

const paymentController = new PaymentController();

router.post("/", auth(), paymentController.addCourseToCart);
router.post("/add-learner", auth(), paymentController.addUserCourse);
router.delete("/", auth(), paymentController.deleteCourseFromCart);
router.get("/", auth(), paymentController.getUserCart);

module.exports = router;
