const SectionDao = require("../dao/SectionDao");
const VideoDao = require("../dao/VideoDao");
// const logger = require("../config/logger");
const httpStatus = require("http-status");
const { returnSuccess, returnError } = require("../helper/responseHandler");

class SectionService {
  constructor() {
    this.VideoDao = new VideoDao();
    this.SectionDao = new SectionDao();
  }

  createSection = async (course_id, title, desc) => {
    try {
      const section = await this.SectionDao.create(course_id, title, desc);
      return returnSuccess(httpStatus.CREATED, "Section created", section);
    } catch (e) {
      // logger.error(`createSection error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        e.message || "Internal Server Error"
      );
    }
  };

  updateOrCreate = async (id, data) => {
    try {
      const section = await this.SectionDao.updateOrCreate(data, id);
      return returnSuccess(httpStatus.CREATED, "Section created", section);
    } catch (e) {
      // logger.error(`createSection error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        e.message || "Internal Server Error"
      );
    }
  };
}

module.exports = SectionService;
