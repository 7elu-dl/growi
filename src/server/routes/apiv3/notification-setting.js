const loggerFactory = require('@alias/logger');

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:routes:apiv3:notification-setting');

const express = require('express');

const router = express.Router();

const { body } = require('express-validator/check');

const ErrorV3 = require('../../models/vo/error-apiv3');

const validator = {
  slackConfiguration: [
    body('webhookUrl').isString().trim(),
    body('isIncomingWebhookPrioritized').isBoolean(),
    body('slackToken').isString().trim(),
  ],
  userNotification: [
    body('pathPattern').isString().trim(),
    body('channel').isString().trim(),
  ],
};

/**
 * @swagger
 *  tags:
 *    name: NotificationSetting
 */

/**
 * @swagger
 *
 *  components:
 *    schemas:
 *      SlackConfigurationParams:
 *        type: object
 *        properties:
 *          webhookUrl:
 *            type: string
 *            description: incoming webhooks url
 *          isIncomingWebhookPrioritized:
 *            type: boolean
 *            description: use incoming webhooks even if Slack App settings are enabled
 *          slackToken:
 *            type: string
 *            description: OAuth access token
 *      UserNotificationParams:
 *        type: object
 *        properties:
 *          pathPattern:
 *            type: string
 *            description: path name of wiki
 *          channel:
 *            type: string
 *            description: slack channel name without '#'
 */
module.exports = (crowi) => {
  const loginRequiredStrictly = require('../../middleware/login-required')(crowi);
  const adminRequired = require('../../middleware/admin-required')(crowi);
  const csrf = require('../../middleware/csrf')(crowi);

  const UpdatePost = crowi.model('UpdatePost');
  const GlobalNotificationSetting = crowi.model('GlobalNotificationSetting');

  const { ApiV3FormValidator } = crowi.middlewares;

  /**
   * @swagger
   *
   *    /_api/v3/notification-setting/:
   *      get:
   *        tags: [NotificationSetting]
   *        description: Get notification paramators
   *        responses:
   *          200:
   *            description: params of notification
   *            content:
   *              application/json:
   *                schema:
   *                  properties:
   *                    notificationParams:
   *                      type: object
   *                      description: notification params
   */
  router.get('/', loginRequiredStrictly, adminRequired, async(req, res) => {

    const notificationParams = {
      webhookUrl: await crowi.configManager.getConfig('notification', 'slack:incomingWebhookUrl'),
      isIncomingWebhookPrioritized: await crowi.configManager.getConfig('notification', 'slack:isIncomingWebhookPrioritized'),
      slackToken: await crowi.configManager.getConfig('notification', 'slack:token'),
      userNotifications: await UpdatePost.findAll(),
      globalNotifications: await GlobalNotificationSetting.findAll(),
    };
    return res.apiv3({ notificationParams });
  });

  /**
   * @swagger
   *
   *    /_api/v3/notification-setting/slack-configuration:
   *      put:
   *        tags: [NotificationSetting]
   *        description: Update slack configuration setting
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                $ref: '#/components/schemas/SlackConfigurationParams'
   *        responses:
   *          200:
   *            description: Succeeded to update slack configuration setting
   *            content:
   *              application/json:
   *                schema:
   *                  $ref: '#/components/schemas/SlackConfigurationParams'
   */
  router.put('/slack-configuration', loginRequiredStrictly, adminRequired, csrf, validator.slackConfiguration, ApiV3FormValidator, async(req, res) => {

    const requestParams = {
      'slack:incomingWebhookUrl': req.body.webhookUrl,
      'slack:isIncomingWebhookPrioritized': req.body.isIncomingWebhookPrioritized,
      'slack:token': req.body.slackToken,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('notification', requestParams);
      const responseParams = {
        webhookUrl: await crowi.configManager.getConfig('notification', 'slack:incomingWebhookUrl'),
        isIncomingWebhookPrioritized: await crowi.configManager.getConfig('notification', 'slack:isIncomingWebhookPrioritized'),
        slackToken: await crowi.configManager.getConfig('notification', 'slack:token'),
      };
      await crowi.setupSlack();
      return res.apiv3({ responseParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating slack configuration';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-slackConfiguration-failed'));
    }

  });

  /**
  * @swagger
  *
  *    /_api/v3/notification-setting/user-notification:
  *      post:
  *        tags: [NotificationSetting]
  *        description: add user notification setting
  *        requestBody:
  *          required: true
  *          content:
  *            application/json:
  *              schema:
  *                $ref: '#/components/schemas/UserNotificationParams'
  *        responses:
  *          200:
  *            description: Succeeded to add user notification setting
  *            content:
  *              application/json:
  *                schema:
  *                  properties:
  *                    createdUser:
  *                      type: object
  *                      description: user who set notification
  *                    userNotifications:
  *                      type: object
  *                      description: user trigger notifications for updated
  */
  router.post('/user-notification', loginRequiredStrictly, adminRequired, csrf, validator.userNotification, ApiV3FormValidator, async(req, res) => {
    const { pathPattern, channel } = req.body;
    const UpdatePost = crowi.model('UpdatePost');

    try {
      logger.info('notification.add', pathPattern, channel);
      const responseParams = {
        createdUser: await UpdatePost.create(pathPattern, channel, req.user),
        userNotifications: await UpdatePost.findAll(),
      };
      return res.apiv3({ responseParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating user notification';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-userNotification-failed'));
    }

  });

  // TODO swagger
  router.put('/global-notification/:id/enabled', loginRequiredStrictly, adminRequired, csrf, async(req, res) => {
    const { id } = req.params;
    const isEnabled = req.query;
    console.log(isEnabled);

    try {
      if (isEnabled) {
        await GlobalNotificationSetting.enable(id);
      }
      else {
        await GlobalNotificationSetting.disable(id);
      }

      return res.apiv3({ id });

    }
    catch (err) {
      const msg = 'Error occurred in toggle of global notification';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'toggle-globalNotification-failed'));
    }

  });

  /**
  * @swagger
  *
  *    /_api/v3/notification-setting/global-notification/{id}:
  *      delete:
  *        tags: [NotificationSetting]
  *        description: delete global notification pattern
  *        parameters:
  *          - name: id
  *            in: path
  *            required: true
  *            description: id of global notification
  *            schema:
  *              type: string
  *        responses:
  *          200:
  *            description: Succeeded to delete global notification pattern
  *            content:
  *              application/json:
  *                schema:
  *                  properties:
  *                    deletedNotificaton:
  *                      type: object
  *                      description: deleted notification
  */
  router.delete('/global-notification/:id', loginRequiredStrictly, adminRequired, csrf, async(req, res) => {
    const { id } = req.params;

    try {
      const deletedNotificaton = await GlobalNotificationSetting.findOneAndRemove({ _id: id });
      return res.apiv3(deletedNotificaton);
    }
    catch (err) {
      const msg = 'Error occurred in delete global notification';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'delete-globalNotification-failed'));
    }


  });

  return router;
};
