const SuperDao = require("./SuperDao");
const models = require("../models");

const UserCourse = models.user_course;

class UserCourseDao extends SuperDao {
  constructor() {
    super(UserCourse);
  }

  async findOneByUser(user_id, id) {
    return this.Model.findOne({
      where: { user_id, id },
      attributes: ["id"],
      include: [
        {
          model: models.course,
          include: [
            {
              model: models.user,
              attributes: ["name"],
            },
            {
              model: models.section,
              include: [
                {
                  model: models.video,
                },
              ],
            },
          ],
        },
      ],
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        // logger.error(e);
        console.log(e);
      });
  }

  async findAllCourseByUser(user_id) {
    return this.Model.findAll({
      where: { user_id },
      include: [
        {
          model: models.course,
          attributes: ["title", "thumbnail"],
          include: [
            {
              model: models.user,
              attributes: ["name"], // Pilih atribut yang diperlukan dari tabel User
            },
          ],
        },
      ],
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async find3CourseByUser(user_id) {
    return this.Model.findAll({
      where: { user_id },
      include: [
        {
          model: models.course,
          attributes: ["title", "thumbnail"],
          include: [
            {
              model: models.user,
              attributes: ["name"], // Pilih atribut yang diperlukan dari tabel User
            },
          ],
        },
      ],
      limit: 3,
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  async findAllLearnerInCourse(course_id) {
    return this.Model.findAll({
      where: { course_id },
      attributes: [],
      include: [
        {
          model: models.user,
          attributes: ["name", "username", "profile_picture", "uuid"],
        },
      ],
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

module.exports = UserCourseDao;
