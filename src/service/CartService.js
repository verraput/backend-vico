const UserDao = require("../dao/UserDao");
const CartDao = require("../dao/CartDao");
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const httpStatus = require("http-status");

class CartService {
  constructor() {
    this.userDao = new UserDao();
    this.cartDao = new CartDao();
  }

  getCartByUserId = async (user_id) => {
    try {
      const cart = await this.cartDao.findAllCart({
        user_id: user_id,
      });
      return responseHandler.returnSuccess(httpStatus.OK, "Cart found", cart);
    } catch (error) {
      logger.error(`getCartByUserId error: ${error}`);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  createCart = async (user_id, course_id) => {
    try {
      const user = await this.userDao.findOneByWhereCreated({ uuid: user_id });
      if (!user) {
        return responseHandler.returnError(
          httpStatus.NOT_FOUND,
          "User not found"
        );
      }
      const cartExist = await this.cartDao.findOneByWhere({
        user_id,
        course_id,
      });
      if (cartExist) {
        return responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Product already in cart"
        );
      }
      const cart = await this.cartDao.create({
        user_id,
        course_id,
      });
      return responseHandler.returnSuccess(
        httpStatus.CREATED,
        "Cart created",
        cart
      );
    } catch (error) {
      logger.error(`createCart error: ${error}`);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };

  deleteCart = async (user_id, id) => {
    try {
      const cart = await this.cartDao.findOneByWhere({
        user_id: user_id,
        course_id: id,
      });
      if (!cart) {
        return responseHandler.returnError(
          httpStatus.NOT_FOUND,
          "Cart not found"
        );
      }
      await this.cartDao.deleteByWhere({ user_id: user_id, course_id: id });
      return responseHandler.returnSuccess(httpStatus.OK, "Cart deleted", null);
    } catch (error) {
      logger.error(`deleteCart error: ${error}`);
      return responseHandler.returnError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal Server Error"
      );
    }
  };
}

module.exports = CartService;
