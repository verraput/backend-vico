const SuperDao = require('./SuperDao');
const models = require('../models');

const Section = models.section;

class SectionDao extends SuperDao {
    constructor() {
        super(Section);
    }

}

module.exports = SectionDao;