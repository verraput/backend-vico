const httpStatus = require("http-status");
const CourseService = require("../service/CourseService");
const UserCourseService = require("../service/UserCourseService");
const VideoService = require("../service/VideoService");
const SectionService = require("../service/SectionService");
const CartService = require("../service/CartService");
const DiskusiService = require("../service/DiskusiService");
const UserService = require("../service/UserService");
// const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");

class PaymentController {
  constructor() {
    this.userService = new UserService();
    this.userCourseService = new UserCourseService();
    this.courseService = new CourseService();
    this.videoService = new VideoService();
    this.sectionService = new SectionService();
    this.cartService = new CartService();
    this.diskusiService = new DiskusiService();
  }

  addCourseToCart = async (req, res) => {
    try {
      const { course_id } = req.body;
      const { uuid, user_type } = req.user;
      if (user_type === "mentor") {
        return res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          message: "Mentor can't add course to cart, please login as learner",
          data: null,
        });
      }
      const course = await this.courseService.getCourse(course_id);
      if (!course.response.status) {
        return res.status(course.statusCode).send(course.response);
      }
      const cart = await this.cartService.createCart(uuid, course_id);
      res.status(cart.statusCode).send(cart.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  deleteCourseFromCart = async (req, res) => {
    try {
      const { course_id } = req.body;
      const { uuid } = req.user;
      const cart = await this.cartService.deleteCart(uuid, course_id);
      res.status(cart.statusCode).send(cart.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getUserCart = async (req, res) => {
    try {
      const { uuid } = req.user;
      const cart = await this.cartService.getCartByUserId(uuid);
      res.status(cart.statusCode).send(cart.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  addUserCourse = async (req, res) => {
    try {
      const { course_id, user_id } = req.body;
      const course = await this.courseService.getCourse(course_id);
      if (!course.response.status) {
        return res.status(course.statusCode).send(course.response);
      }
      const userCourse = await this.userCourseService.enrollCourse(
        user_id,
        course_id,
        req.user
      );
      res.status(userCourse.statusCode).send(userCourse.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  deleteUserCourse = async (req, res) => {
    try {
      const { course_id, user_id } = req.body;
      const userCourse = await this.userCourseService.deleteUserCourse(
        user_id,
        course_id,
        req.user
      );
      res.status(userCourse.statusCode).send(userCourse.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getAllLearnerCourse = async (req, res) => {
    try {
      const course = await this.userCourseService.getAllLearnerinCourse(
        req.body.course_id,
        req.user
      );
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  searchLearner = async (req, res) => {
    try {
      const q = req.query.q;
      const user = await this.userService.searchUser(q, req.user);
      res.status(user.statusCode).send(user.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = PaymentController;
