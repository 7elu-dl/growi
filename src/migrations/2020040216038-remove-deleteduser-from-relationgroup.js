require('module-alias/register');
const logger = require('@alias/logger')('growi:migrate:adjust-pages-path');

const mongoose = require('mongoose');
const config = require('@root/config/migrate');

const { getModelSafely } = require('@commons/util/mongoose-utils');

module.exports = {
  async up(db) {
    logger.info('Apply migration');
    mongoose.connect(config.mongoUri, config.mongodb.options);

    const User = getModelSafely('User') || require('@server/models/user')();
    const UserGroupRelation = getModelSafely('UserGroupRelation') || require('@server/models/user-group-relation')();

    const deletedUsers = await User.find({ status: 4 }); // deleted user
    await UserGroupRelation.remove({ relatedUser: deletedUsers });

    logger.info('Migration has successfully applied');
  },

  down(db) {
    // do not rollback
  },
};
