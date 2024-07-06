const httpStatus = require("http-status");
const CourseService = require("../service/CourseService");
const UserCourseService = require("../service/UserCourseService");
const VideoService = require("../service/VideoService");
const SectionService = require("../service/SectionService");
const DiskusiService = require("../service/DiskusiService");
const UserService = require("../service/UserService");
// const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { deleteFile } = require("../middlewares/imageHandler");
const saltedMd5 = require("salted-md5");
const path = require("path");
var fs = require("fs");

const config = require("../config/config");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: config.firebase_project_id.toString(),
    clientEmail: config.firebase_client_email.toString(),
    privateKey: config.firebase_private_key.toString(),
  }),
  storageBucket: config.bucketUrl,
});

const bucket = admin.storage().bucket();

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
      if (!req.file) {
        return res.status(httpStatus.BAD_REQUEST).send({
          status: false,
          message: "Please upload a file!",
          data: req.file,
        });
      }

      const thumbnail_name = saltedMd5(req.file.originalname, "SUPER-S@LT!");
      const fileName = thumbnail_name + path.extname(req.file.originalname);
      const thumbnail_buffer = fs.readFileSync(req.file.path);
      await bucket.file(fileName).createWriteStream().end(thumbnail_buffer);
      const getDownloadUrl = await bucket.file(fileName).getSignedUrl({
        action: "read",
        expires: "03-09-2491",
      });
      let sections = [];
      let videos = [];

      const course = await this.courseService.createCourse({
        author: req.user.uuid,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        thumbnail: getDownloadUrl[0],
        level: req.body.level,
      });

      if (!course.response.data) {
        return res.status(httpStatus.BAD_GATEWAY).send({
          status: false,
          code: 502,
          message: "Failed to create course!",
        });
      }

      const parsed_section = JSON.parse(req.body.sections);

      for (const section of parsed_section) {
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

      deleteFile(req.file.path);

      res.status(course.statusCode).send({
        ...course.response,
        data: {
          ...course.response.data.dataValues,
          sections: sections,
          videos: videos,
        },
      });
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  updateCourse = async (req, res) => {
    try {
      let sections = [];
      let videos = [];

      let course = await this.courseService.getCourse(req.body.id);
      if (course.statusCode !== 200) {
        return res.status(course.statusCode).send(course.response);
      }

      course = await this.courseService.updateCourse(req.body);
      const sections_data = req.body.sections;

      for (const section of sections_data) {
        let newSection = await this.sectionService.updateOrCreate(
          {
            course_id: course.response.data.id,
            title: section.title,
            desc: section.desc,
          },
          { id: section.id ?? 0 }
        );
        sections.push(newSection.response.data);
        for (const video of section.videos) {
          const newVideo = await this.videoService.updateOrCreate(
            {
              section_id: newSection.response.data.id,
              title: video.title,
              desc: video.desc,
              url: video.url,
              duration: video.duration,
            },
            { id: video.id ?? 0 }
          );
          videos.push(newVideo.response.data);
        }
      }

      res.status(course.statusCode).send(course.response);
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
      const learnerCourse = await this.userCourseService.get3LearnerCourse(
        req.user
      );

      if (courses.statusCode !== 200) {
        return res.status(courses.statusCode).send(courses.response);
      } else if (learnerCourse.statusCode !== 200) {
        return res
          .status(learnerCourse.statusCode)
          .send(learnerCourse.response);
      }
      res.status(courses.statusCode).send({
        status: true,
        code: 200,
        message: "Courses sucess to get",
        data: {
          course: [...courses.response.data],
          learner_progress: [...learnerCourse.response.data],
        },
      });
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

  getAllMentorCourse = async (req, res) => {
    try {
      const course = await this.courseService.getAllMentorCourse(req.user);
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getOneMentorCourse = async (req, res) => {
    try {
      const course = await this.courseService.getOneMentorCourse(
        req.user,
        req.params.id
      );
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getAllLearnerCourse = async (req, res) => {
    try {
      const course = await this.userCourseService.getAllLearnerCourse(req.user);
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  getOneLearnerCourse = async (req, res) => {
    try {
      const course = await this.userCourseService.getOneLearnerCourse(
        req.user,
        req.params.id
      );
      res.status(course.statusCode).send(course.response);
    } catch (e) {
      // logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = CourseController;
