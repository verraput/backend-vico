const VideoStatusDao = require("../dao/VideoStatusDao");
const VideoDao = require("../dao/VideoDao");
const responseHandler = require("../helper/responseHandler");
// const logger = require('../config/logger');
const httpStatus = require("http-status");

class VideoStatusService {
  constructor() {
    this.VideoStatusDao = new VideoStatusDao();
    this.VideoDao = new VideoDao();
  }
}

module.exports = VideoStatusService;
