const mongoose = require('mongoose');

/**
 * parent schema for GlobalNotificationSetting model
 */
const notificationSchema = new mongoose.Schema({
  isEnabled: { type: Boolean, required: true, default: true },
  triggerPath: { type: String, required: true },
  triggerEvents: { type: [String] },
});

module.exports = notificationSchema;
