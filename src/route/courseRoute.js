const express = require("express");
const CourseController = require("../controllers/CourseController");

const router = express.Router();
const auth = require("../middlewares/auth");

const courseController = new CourseController();

router.post("/", auth(), courseController.createCourse);
router.get("/", auth(), courseController.getAllCourse);
router.get("/one/:id", auth(), courseController.getCourse);
router.delete("/:id", auth(), courseController.deleteCourse);

router.get("/:id/diskusi", auth(), courseController.getCourseDiscussion);
router.post("/:id/diskusi", auth(), courseController.createCourseDiscussion);
router.delete("/diskusi/:id", auth(), courseController.deleteCourseDiscussion);

// TODO: Create Route to save user video progress in course

module.exports = router;
