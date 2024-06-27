const SuperDao = require('./SuperDao');
const models = require('../models');

const UserCourse = models.user_course;

class UserCourseDao extends SuperDao {
    constructor() {
        super(UserCourse);
    }

}

module.exports = UserCourseDao;