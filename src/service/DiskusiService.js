const UserDao = require("../dao/UserDao");
const DiskusiDao = require("../dao/DiskusiDao");
const responseHandler = require("../helper/responseHandler");
// const logger = require("../config/logger");
const httpStatus = require("http-status");

class DiskusiService {
  constructor() {
    this.userDao = new UserDao();
    this.diskusiDao = new DiskusiDao();
  }

  getDiskusiByCourseId = async (course_id) => {
    try {
      const diskusi = await this.diskusiDao.findDiskusiByWhere({
        course_id: course_id,
      });
      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Diskusi found",
        diskusi
      );
    } catch (error) {
      // logger.error(`getDiskusiByCourseId error: ${error}`);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  createDiskusi = async (user_id, course_id, message) => {
    try {
      const user = await this.userDao.findOneByWhereCreated({ uuid: user_id });
      if (!user) {
        return responseHandler.returnError(
          httpStatus.NOT_FOUND,
          "User not found"
        );
      }
      const diskusi = await this.diskusiDao.create({
        user_id,
        course_id,
        message,
      });
      return responseHandler.returnSuccess(
        httpStatus.CREATED,
        "Diskusi created",
        diskusi
      );
    } catch (error) {
      // logger.error(`createDiskusi error: ${error}`);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  deleteDiskusi = async (id, user_id) => {
    try {
      const diskusi = await this.diskusiDao.findOneByWhere({
        user_id: user_id,
        id: id,
      });
      if (!diskusi) {
        return responseHandler.returnError(
          httpStatus.NOT_FOUND,
          "Diskusi not found"
        );
      }
      await this.diskusiDao.deleteByWhere({ id, user_id });

      return responseHandler.returnSuccess(
        httpStatus.OK,
        "Diskusi deleted",
        null
      );
    } catch (error) {
      // logger.error(`deleteDiskusi error: ${error}`);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
}

module.exports = DiskusiService;
