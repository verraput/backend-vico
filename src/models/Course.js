'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.user_course, {
        foreignKey: 'course_id',
        sourceKey: 'id'
      })
      this.hasMany(models.diskusi, {
        foreignKey: 'course_id',
        sourceKey: 'id'
      })
      this.hasMany(models.cart, {
        foreignKey: 'course_id',
        sourceKey: 'id'
      })
      this.hasMany(models.section, {
        foreignKey: 'course_id',
        sourceKey: 'id'
      })

      models.user_course.belongsTo(this, {
        foreignKey: 'course_id',
        targetKey: 'id'
      })
      models.diskusi.belongsTo(this, {
        foreignKey: 'course_id',
        targetKey: 'id'
      })
      models.cart.belongsTo(this, {
        foreignKey: 'course_id',
        targetKey: 'id'
      })
      models.section.belongsTo(this, {
        foreignKey: 'course_id',
        targetKey: 'id'
      })  
    }
  }
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    thumbnail: DataTypes.STRING,
    level: DataTypes.ENUM("beginner", "novice", "intermediatte", "expert")
  }, {
    sequelize,
    modelName: 'course',
  });
  return Course;
};