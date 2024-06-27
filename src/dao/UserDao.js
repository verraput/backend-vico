const SuperDao = require("./SuperDao");
const models = require("../models");
const logger = require("../config/logger");

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
          logger.error(e);
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
        logger.error(e);
        console.log(e);
      });
  }
}

module.exports = UserDao;
