const SuperDao = require("./SuperDao");
const models = require("../models");
const { Op } = require("sequelize");
// const logger = require("../config/logger");

const User = models.user;

class UserDao extends SuperDao {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async isEmailExists(email) {
    return User.count({ where: { email } }).then((count) => {
      if (count != 0) {
        return true;
      }
      return false;
    });
  }

  async createWithTransaction(user, transaction) {
    return User.create(user, { transaction });
  }

  async findOneByWhereCreated(
    where,
    attributes = null,
    order = ["created_at", "desc"]
  ) {
    if (attributes == null) {
      return this.Model.findOne({
        where,
        order: [order],
      })
        .then((result) => {
          return result;
        })
        .catch((e) => {
          // logger.error(e);
          console.log(e);
        });
    }
    return this.Model.findOne({
      where,
      attributes,
      order: [order],
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        // logger.error(e);
        console.log(e);
      });
  }

  async searchUserByKeyword(query) {
    return this.Model.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.substring]: `%${query}%` } },
          { username: { [Op.substring]: `%${query}%` } },
          { email: { [Op.substring]: `%${query}%` } },
          { uuid: query },
        ],
      },
      attributes: ["name", "username", "profile_picture", "uuid"],
    })
      .then((result) => {
        return result;
      })
      .catch((e) => {
        // logger.error(e);
        console.log(e);
      });
  }
}

module.exports = UserDao;
