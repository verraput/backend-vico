const SectionDao = require("../dao/SectionDao");
const VideoDao = require("../dao/VideoDao");
// const logger = require("../config/logger");
const httpStatus = require("http-status");
const { returnSuccess, returnError } = require("../helper/responseHandler");

class VideoService {
  constructor() {
    this.sectionDao = new SectionDao();
    this.videoDao = new VideoDao();
  }

  createVideo = async (section_id, title, url, desc) => {
    try {
      const newVideo = await this.videoDao.create(section_id, title, desc, url);
      return returnSuccess(
        httpStatus.CREATED,
        "Video successfully created",
        newVideo
      );
    } catch (error) {
      // logger.error(`Error creating video: ${error}`);
      return returnError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  };

  updateOrCreate = async (data, id) => {
    try {
      const video = await this.videoDao.updateOrCreate(data, id);
      return returnSuccess(httpStatus.CREATED, "Video created", video);
    } catch (e) {
      // logger.error(`createSection error: ${error}`);
      return returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        e.message || "Internal Server Error"
      );
    }
  };
}

module.exports = VideoService;
