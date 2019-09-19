const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:export'); // eslint-disable-line no-unused-vars
const path = require('path');

const express = require('express');

const router = express.Router();

/**
 * @swagger
 *  tags:
 *    name: Export
 */

module.exports = (crowi) => {
  const { exportService } = crowi;

  /**
   * @swagger
   *
   *  /export/status:
   *    get:
   *      tags: [Export]
   *      description: get mongodb collections names and zip files for them
   *      produces:
   *        - application/json
   *      responses:
   *        200:
   *          description: export cache status
   *          content:
   *            application/json:
   */
  router.get('/status', async(req, res) => {
    const files = exportService.getStatus();

    // TODO: use res.apiv3
    return res.json({ ok: true, files });
  });

  /**
   * @swagger
   *
   *  /export/download:
   *    get:
   *      tags: [Export]
   *      description: download a zipped json for multiple collections
   *      produces:
   *        - application/json
   *      responses:
   *        200:
   *          description: a zip file
   *          content:
   *            application/zip:
   */
  router.get('/', async(req, res) => {
    // TODO: add express validator
    try {
      return res.download(exportService.getZipFile(true));
    }
    catch (err) {
      // TODO: use ApiV3Error
      logger.error(err);
      return res.status(500).send({ status: 'ERROR' });
    }
  });

  /**
   * @swagger
   *
   *  /export:
   *    post:
   *      tags: [Export]
   *      description: generate a zipped json for multiple collections
   *      produces:
   *        - application/json
   *      responses:
   *        200:
   *          description: a zip file is generated
   *          content:
   *            application/json:
   */
  router.post('/', async(req, res) => {
    // TODO: add express validator
    try {
      const { collections } = req.body;
      // get model for collection
      const models = collections.map(collectionName => exportService.getModelFromCollectionName(collectionName));
      // export into json
      const jsonFiles = await exportService.exportMultipleCollectionsToJsons(models);
      // zip json
      const configs = jsonFiles.map((jsonFile) => { return { from: jsonFile, as: path.basename(jsonFile) } });
      const zipFile = await exportService.zipFiles(configs);

      // TODO: use res.apiv3
      return res.status(200).json({
        ok: true,
        // collection: [Model.collection.collectionName],
        file: path.basename(zipFile),
      });
    }
    catch (err) {
      // TODO: use ApiV3Error
      logger.error(err);
      return res.status(500).send({ status: 'ERROR' });
    }
  });

  /**
   * @swagger
   *
   *  /export:
   *    delete:
   *      tags: [Export]
   *      description: unlink all json and zip files for exports
   *      produces:
   *        - application/json
   *      responses:
   *        200:
   *          description: the json and zip file are deleted
   *          content:
   *            application/json:
   */
  // router.delete('/', async(req, res) => {
  //   // TODO: add express validator
  //   try {
  //     // remove .json and .zip for collection
  //     // TODO: use res.apiv3
  //     return res.status(200).send({ status: 'DONE' });
  //   }
  //   catch (err) {
  //     // TODO: use ApiV3Error
  //     logger.error(err);
  //     return res.status(500).send({ status: 'ERROR' });
  //   }
  // });

  return router;
};
