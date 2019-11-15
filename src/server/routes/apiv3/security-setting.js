/* eslint-disable no-unused-vars */
const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:security-setting');

const express = require('express');

const router = express.Router();

const { body } = require('express-validator/check');
const ErrorV3 = require('../../models/vo/error-apiv3');

const validator = {};

/**
 * @swagger
 *  tags:
 *    name: SecuritySetting
 */

module.exports = (crowi) => {
  const loginRequiredStrictly = require('../../middleware/login-required')(crowi);
  const adminRequired = require('../../middleware/admin-required')(crowi);
  const csrf = require('../../middleware/csrf')(crowi);

  const { ApiV3FormValidator } = crowi.middlewares;

  const validator = {
    guestMode: [
      body('restrictGuestMode').isString(),
    ],
    pageDeletion: [
      body('pageCompleteDeletionAuthority').isString(),
    ],
    function: [
      body('hideRestrictedByOwner').isBoolean(),
      body('hideRestrictedByGroup').isBoolean(),
    ],
  };


  router.put('/guestMode', loginRequiredStrictly, adminRequired, csrf, validator.guestMode, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'security:restrictGuestMode': req.body.restrictGuestMode,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const securitySettingParams = {
        restrictGuestMode: await crowi.configManager.getConfig('crowi', 'security:restrictGuestMode'),
      };
      return res.apiv3({ securitySettingParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating layout and theme';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-layoutTheme-failed'));
    }
  });


  router.put('/pageDeletion', loginRequiredStrictly, adminRequired, csrf, validator.pageDeletion, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'security:pageCompleteDeletionAuthority': req.body.pageCompleteDeletionAuthority,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const securitySettingParams = {
        pageCompleteDeletionAuthority: await crowi.configManager.getConfig('crowi', 'security:pageCompleteDeletionAuthority'),
      };
      return res.apiv3({ securitySettingParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating page-deletion-setting';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-page-deletion-setting-failed'));
    }
  });

  router.put('/function', loginRequiredStrictly, adminRequired, csrf, validator.function, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'security:list-policy:hideRestrictedByOwner': req.body.hideRestrictedByOwner,
      'security:list-policy:hideRestrictedByGroup': req.body.hideRestrictedByGroup,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const securitySettingParams = {
        hideRestrictedByOwner: await crowi.configManager.getConfig('crowi', 'security:list-policy:hideRestrictedByOwner'),
        hideRestrictedByGroup: await crowi.configManager.getConfig('crowi', 'customize:security:list-policy:hideRestrictedByGroup'),
      };
      return res.apiv3({ securitySettingParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating function';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-function-failed'));
    }
  });

  return router;
};
