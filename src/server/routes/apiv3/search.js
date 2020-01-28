const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:search'); // eslint-disable-line no-unused-vars

const express = require('express');
const { query } = require('express-validator');

const router = express.Router();

const helmet = require('helmet');


/**
 * @swagger
 *  tags:
 *    name: Search
 */
module.exports = (crowi) => {
  const accessTokenParser = require('../../middleware/access-token-parser')(crowi);
  const loginRequired = require('../../middleware/login-required')(crowi);
  const adminRequired = require('../../middleware/admin-required')(crowi);
  const csrf = require('../../middleware/csrf')(crowi);

  const { ApiV3FormValidator } = crowi.middlewares;

  /**
   * @swagger
   *
   *  /search/indices:
   *    get:
   *      tags: [Search]
   *      summary: /search/indices
   *      description: Get current status of indices
   *      responses:
   *        200:
   *          description: Status of indices
   *          content:
   *            application/json:
   *              schema:
   *                properties:
   */
  router.get('/indices', helmet.noCache(), accessTokenParser, loginRequired, adminRequired, async(req, res) => {
    try {
      const search = crowi.getSearcher();
      const info = await search.getInfoForAdmin();
      return res.status(200).send({ info });
    }
    catch (err) {
      return res.apiv3Err(err);
    }
  });


  const validatorForPutIndices = [
    query('operation').isString().isIn(['rebuild', 'normalize']),
  ];

  /**
   * @swagger
   *
   *  /search/indices:
   *    put:
   *      tags: [Search]
   *      summary: /search/indices
   *      description: Operate indices
   *      responses:
   *        200:
   *          description: Return 200
   *          content:
   *            application/json:
   *              schema:
   *                properties:
   */
  router.put('/indices', accessTokenParser, loginRequired, adminRequired, csrf, validatorForPutIndices, ApiV3FormValidator, async(req, res) => {
    const operation = req.query.operation;

    try {
      const search = crowi.getSearcher();

      switch (operation) {
        case 'normalize':
          search.initIndices();
          break;
        case 'rebuild':
          search.buildIndex();
          break;
        default:
          throw new Error(`Unimplemented operation: ${operation}`);
      }

      return res.status(200).send();
    }
    catch (err) {
      return res.apiv3Err(err);
    }
  });

  return router;
};
