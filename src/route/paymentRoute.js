const express = require("express");
const PaymentController = require("../controllers/PaymentController");

const router = express.Router();
const auth = require("../middlewares/auth");

const paymentController = new PaymentController();


// NOTE: Course Route for learner
router.post("/", auth(), paymentController.addCourseToCart);
router.delete("/", auth(), paymentController.deleteCourseFromCart);
router.get("/", auth(), paymentController.getUserCart);

// NOTE: Course Route for mentor
router.post("/add-learner", auth(), paymentController.addUserCourse);
router.get("/search-learner", auth(), paymentController.searchLearner);
router.post("/all-learner", auth(), paymentController.getAllLearnerCourse);
router.delete("/delete-learner", auth(), paymentController.deleteUserCourse);

module.exports = router;
