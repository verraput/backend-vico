const SuperDao = require("./SuperDao");
const models = require("../models");

const Diskusi = models.diskusi;

class DiskusiDao extends SuperDao {
  constructor() {
    super(Diskusi);
  }

  async findDiskusiByWhere(where, order = ["createdAt", "asc"]) {
    return this.Model.findAll({
      where,
      include: [
        {
          model: models.user,
          as: "user",
          attributes: ["name", "profile_picture", "uuid"],
        },
      ],
      order: [order],
    });
  }
}

module.exports = DiskusiDao;
