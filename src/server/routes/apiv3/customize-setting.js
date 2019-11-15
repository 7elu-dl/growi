/* eslint-disable no-unused-vars */
const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:customize-setting');

const express = require('express');

const router = express.Router();

const { body } = require('express-validator/check');
const ErrorV3 = require('../../models/vo/error-apiv3');

const validator = {};

/**
 * @swagger
 *  tags:
 *    name: CustomizeSetting
 */

module.exports = (crowi) => {
  const loginRequiredStrictly = require('../../middleware/login-required')(crowi);
  const adminRequired = require('../../middleware/admin-required')(crowi);
  const csrf = require('../../middleware/csrf')(crowi);

  const { ApiV3FormValidator } = crowi.middlewares;

  // TODO GW-533 implement accurate validation
  const validator = {
    layoutTheme: [
      body('layoutType').isString(),
      body('themeType').isString(),
    ],
    behavior: [
      body('behaviorType').isString(),
    ],
    function: [
      body('isEnabledTimeline').isBoolean(),
      body('isSavedStatesOfTabChanges').isBoolean(),
      body('isEnabledAttachTitleHeader').isBoolean(),
      body('recentCreatedLimit').isInt(),
    ],
    highlight: [
      body('highlightJsStyle').isString(),
      body('highlightJsStyleBorder').isBoolean(),
    ],
  };

  // TODO GW-575 writte swagger
  router.get('/', loginRequiredStrictly, adminRequired, async(req, res) => {

    // TODO GW-575 return others customize settings

    /* eslint-disable quote-props, no-multi-spaces */
    const highlightJsCssSelectorOptions = {
      'github':           { name: '[Light] GitHub',         border: false },
      'github-gist':      { name: '[Light] GitHub Gist',    border: true },
      'atom-one-light':   { name: '[Light] Atom One Light', border: true },
      'xcode':            { name: '[Light] Xcode',          border: true },
      'vs':               { name: '[Light] Vs',             border: true },
      'atom-one-dark':    { name: '[Dark] Atom One Dark',   border: false },
      'hybrid':           { name: '[Dark] Hybrid',          border: false },
      'monokai':          { name: '[Dark] Monokai',         border: false },
      'tomorrow-night':   { name: '[Dark] Tomorrow Night',  border: false },
      'vs2015':           { name: '[Dark] Vs 2015',         border: false },
    };
    /* eslint-enable quote-props, no-multi-spaces */

    return res.apiv3({ highlightJsCssSelectorOptions });
  });

  /**
   * @swagger
   *
   *    /customize-setting/layoutTheme:
   *      put:
   *        tags: [CustomizeSetting]
   *        description: Update layout and theme
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schama:
   *                type: object
   *                properties:
   *                  layoutType:
   *                    description: type of layout
   *                    type: string
   *                  themeType:
   *                    description: type of theme
   *                    type: string
   *      responses:
   *          200:
   *            description: Succeeded to update layout and theme
   */
  router.put('/layoutTheme', loginRequiredStrictly, adminRequired, csrf, validator.layoutTheme, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'customize:layout': req.body.layoutType,
      'customize:theme': req.body.themeType,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const customizedParams = {
        layoutType: await crowi.configManager.getConfig('crowi', 'customize:layout'),
        themeType: await crowi.configManager.getConfig('crowi', 'customize:theme'),
      };
      return res.apiv3({ customizedParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating layout and theme';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-layoutTheme-failed'));
    }
  });

  /**
   * @swagger
   *
   *    /customize-setting/behavior:
   *      put:
   *        tags: [CustomizeSetting]
   *        description: Update behavior
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schama:
   *                type: object
   *                properties:
   *                  behaviorType:
   *                    description: type of behavior
   *                    type: string
   *      responses:
   *          200:
   *            description: Succeeded to update behavior
   */
  router.put('/behavior', loginRequiredStrictly, adminRequired, csrf, validator.behavior, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'customize:behavior': req.body.behaviorType,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const customizedParams = {
        behaviorType: await crowi.configManager.getConfig('crowi', 'customize:behavior'),
      };
      return res.apiv3({ customizedParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating behavior';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-behavior-failed'));
    }
  });

  /**
   * @swagger
   *
   *    /customize-setting/function:
   *      put:
   *        tags: [CustomizeSetting]
   *        description: Update function
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schama:
   *                type: object
   *                properties:
   *                  isEnabledTimeline:
   *                    description: is enabled timeline
   *                    type: boolean
   *                  isSavedStatesOfTabChanges:
   *                    description: is saved states of tabChanges
   *                    type: boolean
   *                  isEnabledAttachTitleHeader:
   *                    description: is enabled attach titleHeader
   *                    type: boolean
   *                  recentCreatedLimit:
   *                    description: limit of recent created
   *                    type: number
   *      responses:
   *          200:
   *            description: Succeeded to update function
   */
  router.put('/function', loginRequiredStrictly, adminRequired, csrf, validator.function, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'customize:isEnabledTimeline': req.body.isEnabledTimeline,
      'customize:isSavedStatesOfTabChanges': req.body.isSavedStatesOfTabChanges,
      'customize:isEnabledAttachTitleHeader': req.body.isEnabledAttachTitleHeader,
      'customize:showRecentCreatedNumber': req.body.recentCreatedLimit,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const customizedParams = {
        isEnabledTimeline: await crowi.configManager.getConfig('crowi', 'customize:isEnabledTimeline'),
        isSavedStatesOfTabChanges: await crowi.configManager.getConfig('crowi', 'customize:isSavedStatesOfTabChanges'),
        isEnabledAttachTitleHeader: await crowi.configManager.getConfig('crowi', 'customize:isEnabledAttachTitleHeader'),
        recentCreatedLimit: await crowi.configManager.getConfig('crowi', 'customize:showRecentCreatedNumber'),
      };
      return res.apiv3({ customizedParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating function';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-function-failed'));
    }
  });

  /**
   * @swagger
   *
   *    /customize-setting/highlight:
   *      put:
   *        tags: [CustomizeSetting]
   *        description: Update highlight
   *        requestBody:
   *          required: true
   *          content:
   *            application/json:
   *              schama:
   *                type: object
   *                properties:
   *                  highlightJsStyle:
   *                    description: style name of highlight
   *                    type: string
   *                  highlightJsStyleBorder:
   *                    description: enable border of highlight
   *                    type: boolean
   *      responses:
   *          200:
   *            description: Succeeded to update highlight
   */
  router.put('/highlight', loginRequiredStrictly, adminRequired, csrf, validator.highlight, ApiV3FormValidator, async(req, res) => {
    const requestParams = {
      'customize:highlightJsStyle': req.body.highlightJsStyle,
      'customize:highlightJsStyleBorder': req.body.highlightJsStyleBorder,
    };

    try {
      await crowi.configManager.updateConfigsInTheSameNamespace('crowi', requestParams);
      const customizedParams = {
        styleName: await crowi.configManager.getConfig('crowi', 'customize:highlightJsStyle'),
        styleBorder: await crowi.configManager.getConfig('crowi', 'customize:highlightJsStyleBorder'),
      };
      return res.apiv3({ customizedParams });
    }
    catch (err) {
      const msg = 'Error occurred in updating highlight';
      logger.error('Error', err);
      return res.apiv3Err(new ErrorV3(msg, 'update-highlight-failed'));
    }
  });

  return router;
};
