/* eslint-disable no-unused-vars */
const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:security-setting');

const express = require('express');

const router = express.Router();

const { body } = require('express-validator/check');
const ErrorV3 = require('../../models/vo/error-apiv3');

const validator = {
  // TODO correct validator
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

/**
 * @swagger
 *  tags:
 *    name: SecuritySetting
 */


/**
 * @swagger
 *
 *  components:
 *    schemas:
 *      GuestModeParams:
 *        type: object
 *        properties:
 *          restrictGuestMode:
 *            type: string
 *            description: type of restrictGuestMode
 *      PageDeletionParams:
 *        type: object
 *        properties:
 *          pageCompleteDeletionAuthority:
 *            type: string
 *            description: type of pageDeletionAuthority
 *      HideParams:
 *        type: object
 *        properties:
 *          hideRestrictedByOwner:
 *            type: boolean
 *            description: enable hide by owner
 *          hideRestrictedByGroup:
 *            type: boolean
 *            description: enable hide by group
 */

module.exports = (crowi) => {
  const loginRequiredStrictly = require('../../middleware/login-required')(crowi);
  const adminRequired = require('../../middleware/admin-required')(crowi);
  const csrf = require('../../middleware/csrf')(crowi);

  const { ApiV3FormValidator } = crowi.middlewares;

  /**
   * @swagger
   *
   *    /security-setting/guest-mode:
   *      put:
   *        tags: [SecuritySetting]
   *        description: Update restrictGuestMode
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  restrictGuestMode:
   *                    description: type of restrictGuestMode
   *                    type: string
   *        responses:
   *          200:
   *            description: Succeeded to update restrictGuestMode
   *            content:
   *              application/json:
   *                schema:
   *                  properties:
   *                    status:
   *                      $ref: '#/components/schemas/GuestModeParams'
   */
  router.put('/guest-mode', loginRequiredStrictly, adminRequired, csrf, validator.guestMode, ApiV3FormValidator, async(req, res) => {
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
      const msg = 'Error occurred in updating restrict guest mode';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-restrictGuestMode-failed'));
    }
  });

  /**
   * @swagger
   *
   *    /security-setting/page-deletion:
   *      put:
   *        tags: [SecuritySetting]
   *        description: Update pageDeletion Setting
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                 pageCompleteDeletionAuthority:
   *                    description: type of pageCompleteDeletionAuthority
   *                    type: string
   *        responses:
   *          200:
   *            description: Succeeded to update pageDeletion
   *            content:
   *              application/json:
   *                schema:
   *                  properties:
   *                    status:
   *                      $ref: '#/components/schemas/PageDeletionParams'
   */
  router.put('/page-deletion', loginRequiredStrictly, adminRequired, csrf, validator.pageDeletion, ApiV3FormValidator, async(req, res) => {
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

  /**
   * @swagger
   *
   *    /security-setting/function:
   *      put:
   *        tags: [SecuritySetting]
   *        description: Update function
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schema:
   *                type: object
   *                properties:
   *                  hideRestrictedByOwner:
   *                    description: is enabled hideRestrictedByOwner
   *                    type: boolean
   *                  ihideRestrictedByGroup:
   *                    description: is enabled hideRestrictedBygroup
   *                    type: boolean
   *        responses:
   *          200:
   *            description: Succeeded to update function
   *            content:
   *              application/json:
   *                schema:
   *                  properties:
   *                    status:
   *                      $ref: '#/components/schemas/HideParams'
   */
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
