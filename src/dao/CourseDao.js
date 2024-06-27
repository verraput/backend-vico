const SuperDao = require("./SuperDao");
const models = require("../models");

const Course = models.course;

class CourseDao extends SuperDao {
  constructor() {
    super(Course);
  }

  async findAllCourse() {
    return this.Model.findAll({
      include: [
        {
          model: models.user,
          attributes: ["name"], // Pilih atribut yang diperlukan dari tabel User
        },
        {
          model: models.user_course,
          attributes: ["id"],
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

  async findCourseById(id) {
    return this.Model.findOne({
      where: { id },
      include: [
        {
          model: models.user,
          attributes: ["name"], // Pilih atribut yang diperlukan dari tabel User
        },
        {
          model: models.user_course,
          attributes: ["id"],
        },
        {
          model: models.section,
          attributes: ["title"],
          include: [
            {
              model: models.video,
              attributes: ["title", "duration"],
            },
          ]
        },
      ],
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        logger.error(e);
        console.log(e);
      });
  }
}

module.exports = CourseDao;
