const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.course, {
        foreignKey: "author",
        sourceKey: "uuid",
      });
      this.hasMany(models.cart, {
        foreignKey: "user_id",
        sourceKey: "uuid",
      });
      this.hasMany(models.user_course, {
        foreignKey: "user_id",
        sourceKey: "uuid",
      });
      this.hasMany(models.diskusi, {
        foreignKey: "user_id",
        sourceKey: "uuid",
      });
      this.hasMany(models.video_status, {
        foreignKey: "user_id",
        sourceKey: "uuid",
      });

      // define association here
      models.course.belongsTo(this, {
        foreignKey: "author",
        targetKey: "uuid",
      });
      models.cart.belongsTo(this, {
        foreignKey: "user_id",
        targetKey: "uuid",
      });
      models.user_course.belongsTo(this, {
        foreignKey: "user_id",
        targetKey: "uuid",
      });
      models.diskusi.belongsTo(this, {
        foreignKey: "user_id",
        targetKey: "uuid",
      });
      models.video_status.belongsTo(this, {
        foreignKey: "user_id",
        targetKey: "uuid",
      });
    }
  }

  User.init(
    {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      profile_picture: DataTypes.STRING,
      user_type: DataTypes.ENUM("admin", "learner", "mentor"),
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      status: DataTypes.INTEGER,
      email_verified: DataTypes.INTEGER,
      phone_number: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
    }
  );
  return User;
};
