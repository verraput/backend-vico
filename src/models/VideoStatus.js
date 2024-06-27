'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VideoStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  VideoStatus.init({
    video_watch: DataTypes.ENUM("watched", "in-progress"),
    timestamp: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'video_status',
  });
  return VideoStatus;
};