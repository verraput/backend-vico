const SuperDao = require("./SuperDao");
const models = require("../models");
const { Sequelize } = require("sequelize");

const Cart = models.cart;

class CartDao extends SuperDao {
  constructor() {
    super(Cart);
  }

  async findAllCart(where, order = ["createdAt", "asc"]) {
    return this.Model.findAll({
      where,
      include: [
        {
        //   attributes: {
        //     include: [
        //       [
        //         Sequelize.fn("COUNT", Sequelize.col("course.sections.title")),
        //         "sectionCount",
        //       ],
        //       [
        //         Sequelize.fn(
        //           "SUM",
        //           Sequelize.col("sections.videos.videoCount")
        //         ),
        //         "allVideoCount",
        //       ],
        //     ],
        //   },
          model: models.course,
          attributes: ["title", "price", "thumbnail", "level"],
          include: [
            {
              model: models.user,
              attributes: ["name"],
            },
            {
              model: models.section,
              attributes: ["createdAt"],
              subQuery: false,
            //   attributes: {
            //     include: [
            //       [
            //         Sequelize.fn("COUNT", Sequelize.col("duration")),
            //         "videoCount",
            //       ],
            //     ],
            //   },
              include: [
                {
                  model: models.video,
                  attributes: ["duration"],
                },
              ],
            },
          ],
        },
      ],
      order: [order],
    });
  }
}

module.exports = CartDao;
