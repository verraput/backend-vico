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

  enrollCourse = async (user_id, course_id, mentorRef) => {
    try {
      if (mentorRef.user_type !== "mentor") {
        return returnError(httpStatus.BAD_REQUEST, "User is not mentor");
      } else if (mentorRef.uuid === user_id) {
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
      } else if (course.author !== mentorRef.uuid) {
        return returnError(
          httpStatus.BAD_REQUEST,
          "Course not belong to mentor, you can't enroll this course for someone else"
        );
      }
      const isEnrolled = await this.userCourseDao.findOneByWhere({
        user_id,
        course_id,
      });
      if (isEnrolled) {
        return returnError(
          httpStatus.BAD_REQUEST,
          "User already enrolled in this course"
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

  deleteUserCourse = async (user_id, course_id, mentorRef) => {
    try {
      const userCourse = await this.userCourseDao.findOneByWhere({
        user_id,
        course_id,
      });
      if (!userCourse) {
        return returnError(httpStatus.NOT_FOUND, "User course not found");
      }
      const mentor = await this.userDao.findOneByWhereCreated({
        uuid: mentorRef.uuid,
      });
      if (!mentor) {
        return returnError(httpStatus.NOT_FOUND, "Mentor not found");
      } else if (mentor.user_type !== "mentor") {
        return returnError(httpStatus.BAD_REQUEST, "User is not mentor");
      } else if (mentor.uuid !== mentorRef.uuid) {
        return returnError(
          httpStatus.BAD_REQUEST,
          "User can't delete course for someone else"
        );
      }

      await this.userCourseDao.deleteByWhere({ id: userCourse.id });
      return returnSuccess(
        httpStatus.OK,
        `User  deleted from course successfully`
      );
    } catch (error) {
      // logger.error(`deleteUserCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getAllLearnerCourse = async (user) => {
    try {
      if (user.user_type !== "learner") {
        return returnError(httpStatus.BAD_REQUEST, "User is not learner");
      }
      const user_id = user.uuid;

      const courses = await this.userCourseDao.findAllCourseByUser(user_id);
      return returnSuccess(httpStatus.OK, "Courses found", courses);
    } catch (error) {
      // logger.error(`getAllLearnerCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  get3LearnerCourse = async (user) => {
    try {
      if (user.user_type !== "learner") {
        return returnError(httpStatus.BAD_REQUEST, "User is not learner");
      }
      const user_id = user.uuid;

      const courses = await this.userCourseDao.find3CourseByUser(user_id);
      return returnSuccess(httpStatus.OK, "Courses found", courses);
    } catch (error) {
      // logger.error(`getAllLearnerCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getOneLearnerCourse = async (user, id) => {
    try {
      if (user.user_type !== "learner") {
        return returnError(httpStatus.BAD_REQUEST, "User is not learner");
      }
      const user_id = user.uuid;

      const userCourse = await this.userCourseDao.findOneByUser(user_id, id);

      if (!userCourse) {
        return returnError(
          httpStatus.NOT_FOUND,
          "User is not enrolled in this course"
        );
      }

      return returnSuccess(httpStatus.OK, "Course found", userCourse);
    } catch (error) {
      // logger.error(`getOneLearnerCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  getAllLearnerinCourse = async (course_id, mentor) => {
    try {
      if (mentor.user_type !== "mentor") {
        return returnError(httpStatus.BAD_REQUEST, "User is not mentor");
      }
      const course = await this.courseDao.findById(course_id);
      if (!course) {
        return returnError(httpStatus.NOT_FOUND, "Course not found");
      } else if (course.author !== mentor.uuid) {
        return returnError(
          httpStatus.BAD_REQUEST,
          "Course not belong to mentor, you can't get learner in this course"
        );
      }
      const learner = await this.userCourseDao.findAllLearnerInCourse(
        course_id
      );
      if (!learner) {
        return returnError(httpStatus.NOT_FOUND, "Course not found");
      }
      const result = learner.map((record) => {
        return record.user;
      });
      return returnSuccess(httpStatus.OK, "Learners found", {
        course,
        learner: result,
      });
    } catch (error) {
      // logger.error(`getAllLearnerinCourse error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
}

module.exports = UserCourseService;
