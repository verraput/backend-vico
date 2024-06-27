const SuperDao = require('./SuperDao');
const models = require('../models');

const VideoStatus = models.video_status;

class VideoStatusDao extends SuperDao {
    constructor() {
        super(VideoStatus);
    }

}

module.exports = VideoStatusDao;