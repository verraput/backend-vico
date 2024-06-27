const UserDao = require("../dao/UserDao");
const UserCourseDao = require("../dao/UserCourseDao");
const CourseDao = require("../dao/CourseDao");
// const logger = require("../config/logger");
const httpStatus = require("http-status");
const { returnError, returnSuccess } = require("../helper/responseHandler");

class UserCourseService {
  constructor() {
    this.userDao = new UserDao();
    this.userCourseDao = new UserCourseDao();
    this.courseDao = new CourseDao();
  }

  countLearner = async (course_id) => {
    try {
      const count = await this.userCourseDao.getCountByWhere(course_id);
      return returnSuccess(httpStatus.OK, "Count learner success", count);
    } catch (error) {
      // logger.error(`countLearner error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  enrollCourse = async (user_id, course_id, mentor_id) => {
    try {
      const mentor = await this.userDao.findOneByWhereCreated({
        uuid: mentor_id,
      });
      if (!mentor) {
        return returnError(httpStatus.NOT_FOUND, "Mentor not found");
      } else if (mentor.user_type !== "mentor") {
        return returnError(httpStatus.BAD_REQUEST, "User is not mentor");
      } else if (mentor.uuid === user_id) {
        return returnError(
          httpStatus.BAD_REQUEST,
          "User can't enroll their own course"
        );
      }

      const user = await this.userDao.findOneByWhereCreated({ uuid: user_id });
      if (!user) {
        return returnError(httpStatus.NOT_FOUND, "User not found");
      } else if (user.user_type !== "learner") {
        return returnError(
          httpStatus.BAD_REQUEST,
          "User is not learner, please ensure the user is learner"
        );
      }

      const course = await this.courseDao.findById(course_id);
      if (!course) {
        return returnError(httpStatus.NOT_FOUND, "Course not found");
      } else if (course.author !== mentor_id) {
        return returnError(
          httpStatus.BAD_REQUEST,
          "Course not belong to mentor, you can't enroll this course for someone else"
        );
      }
      const userCourse = await this.userCourseDao.create({
        user_id,
        course_id,
      });
      return returnSuccess(
        httpStatus.CREATED,
        "Enroll course success",
        userCourse
      );
    } catch (error) {
      // logger.error(`enrollCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
}

module.exports = UserCourseService;
