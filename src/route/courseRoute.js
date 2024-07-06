const express = require("express");
const CourseController = require("../controllers/CourseController");

const router = express.Router();
const auth = require("../middlewares/auth");
const { saveFile } = require("../middlewares/imageHandler");

const courseController = new CourseController();

// NOTE: Course Route for mentor
router.post("/", auth(), saveFile.single("thumbnail"), courseController.createCourse);
router.put("/", auth(), courseController.updateCourse);
router.delete("/:id", auth(), courseController.deleteCourse);
router.get("/mentor", auth(), courseController.getAllMentorCourse);
router.get("/mentor/:id", auth(), courseController.getOneMentorCourse);

// NOTE: Course Route for learner
router.get("/", auth(), courseController.getAllCourse); // untuk bagian home
router.get("/one/:id", auth(), courseController.getCourse); // untuk bagian detail course
router.get("/learner", auth(), courseController.getAllLearnerCourse); 
router.get("/learner/:id", auth(), courseController.getOneLearnerCourse); 
// TODO: Create Route to save learner video progress in course
// TODO: Create Route to get all learner course progress in course

// NOTE: Diskusi for one course 
router.get("/:id/diskusi", auth(), courseController.getCourseDiscussion);
router.post("/:id/diskusi", auth(), courseController.createCourseDiscussion);
router.delete("/diskusi/:id", auth(), courseController.deleteCourseDiscussion);


module.exports = router;
