'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.video_status, {
        foreignKey: 'video_id',
        sourceKey: 'id'
      })
      models.video_status.belongsTo(this, {
        foreignKey: 'video_id',
        targetKey: 'id'
      })
    }
  }
  Video.init({
    url: DataTypes.STRING,
    title: DataTypes.STRING,
    desc: DataTypes.STRING,
    duration: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'video',
  });
  return Video;
};