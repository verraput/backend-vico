const httpStatus = require("http-status");
const CourseService = require("../service/CourseService");
const UserCourseService = require("../service/UserCourseService");
const VideoService = require("../service/VideoService");
const SectionService = require("../service/SectionService");
const DiskusiService = require("../service/DiskusiService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");

class CourseController {
  constructor() {
    this.userService = new UserService();
    this.userCourseService = new UserCourseService();
    this.courseService = new CourseService();
    this.videoService = new VideoService();
    this.sectionService = new SectionService();
    this.diskusiService = new DiskusiService();
  }

  createCourse = async (req, res) => {
    try {
      let sections = [];
      let videos = [];
      const course = await this.courseService.createCourse({
        author: req.user.uuid,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        thumbnail: req.body.thumbnail,
        level: req.body.level,
      });
      for (const section of req.body.sections) {
        const newSection = await this.sectionService.createSection({
          course_id: course.response.data.id,
          title: section.title,
          desc: section.desc,
        });
        sections.push(newSection.response.data);
        for (const video of section.videos) {
          const newVideo = await this.videoService.createVideo({
            section_id: newSection.response.data.id,
            title: video.title,
            desc: video.desc,
            url: video.url,
            duration: video.duration,
          });
          videos.push(newVideo.response.data);
        }
      }

      res
        .status(course.statusCode)
        .send({ ...course.response, sections: sections, videos: videos });
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getCourse = async (req, res) => {
    try {
      const course = await this.courseService.getCourse(req.params.id);
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getAllCourse = async (req, res) => {
    try {
      const courses = await this.courseService.getAllCourse();
      //   const countlearner =  await this.userCourseService.countLearner();
      res.status(courses.statusCode).send(courses.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  deleteCourse = async (req, res) => {
    try {
      const course = await this.courseService.deleteCourse(req.params.id);
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getCourseDiscussion = async (req, res) => {
    try {
      const course = await this.diskusiService.getDiskusiByCourseId(
        req.params.id
      );
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  createCourseDiscussion = async (req, res) => {
    try {
      const course = await this.diskusiService.createDiskusi(
        req.user.uuid,
        req.params.id,
        req.body.message
      );
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  deleteCourseDiscussion = async (req, res) => {
    try {
      const course = await this.diskusiService.deleteDiskusi(
        req.params.id,
        req.user.uuid
      );
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = CourseController;
