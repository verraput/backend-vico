'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Section extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.video, {
        foreignKey: 'section_id',
        sourceKey: 'id'
      })
      
      models.video.belongsTo(this, {
        foreignKey: 'section_id',
        targetKey: 'id'
      })
    }
  }
  Section.init({
    title: DataTypes.STRING,
    desc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'section',
  });
  return Section;
};