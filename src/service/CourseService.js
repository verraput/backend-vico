const UserDao = require("../dao/UserDao");
const CourseDao = require("../dao/CourseDao");
// const logger = require("../config/logger");
const httpStatus = require("http-status");
const { returnSuccess, returnError } = require("../helper/responseHandler");

class CourseService {
  constructor() {
    this.userDao = new UserDao();
    this.courseDao = new CourseDao();
  }

  createCourse = async (
    author,
    title,
    description,
    price,
    thumbnail,
    level
  ) => {
    try {
      const course = await this.courseDao.create(
        author,
        title,
        description,
        price,
        thumbnail,
        level
      );
      return returnSuccess(httpStatus.CREATED, "Course created", course);
    } catch (error) {
      // logger.error(`createCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  updateCourse = async (course) => {
    try {
      const updatedCourse = await this.courseDao.updateById(
        {
          level: course.level,
          title: course.title,
          description: course.description,
          price: course.price,
        },
        course.id
      );
      return returnSuccess(httpStatus.OK, "Course updated", updatedCourse);
    } catch (error) {
      // logger.error(`updateCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getCourse = async (id) => {
    try {
      const course = await this.courseDao.findCourseById(id);
      if (!course) {
        return returnError(httpStatus.NOT_FOUND, "Course not found");
      }
      return returnSuccess(httpStatus.OK, "Course found", course);
    } catch (error) {
      // logger.error(`getCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getAllCourse = async () => {
    try {
      const courses = await this.courseDao.findAllCourse();
      return returnSuccess(httpStatus.OK, "Courses found", courses);
    } catch (error) {
      // logger.error(`getAllCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  deleteCourse = async (id) => {
    try {
      const course = await this.courseDao.findCourseById(id);
      if (!course) {
        return returnError(httpStatus.NOT_FOUND, "Course not found");
      }
      await this.courseDao.deleteByWhere({ id: id });
      return returnSuccess(httpStatus.OK, "Course deleted", null);
    } catch (error) {
      // logger.error(`deleteCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getAllMentorCourse = async (mentor) => {
    try {
      if (mentor.user_type !== "mentor") {
        return returnError(httpStatus.BAD_REQUEST, "User is not mentor");
      }

      const courses = await this.courseDao.findAllCourseByAuthor(mentor.uuid);

      return returnSuccess(httpStatus.OK, "Courses found", courses);
    } catch (error) {
      // logger.error(`deleteCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getOneMentorCourse = async (mentor, id) => {
    try {
      if (mentor.user_type !== "mentor") {
        return returnError(httpStatus.BAD_REQUEST, "User is not mentor");
      }

      const course = await this.courseDao.findOneByMentor({
        id,
      });

      if (!course) {
        return returnError(httpStatus.NOT_FOUND, "Course not found");
      }

      return returnSuccess(httpStatus.OK, "Course found", course);
    } catch (error) {
      // logger.error(`deleteCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
}

module.exports = CourseService;
