const loggerFactory = require('@alias/logger');

const logger = loggerFactory('growi:routes:apiv3:import'); // eslint-disable-line no-unused-vars
const path = require('path');
const multer = require('multer');
const { ObjectId } = require('mongoose').Types;

const express = require('express');

const router = express.Router();

/**
 * @swagger
 *  tags:
 *    name: Import
 */

module.exports = (crowi) => {
  const { growiBridgeService, importService } = crowi;
  const uploads = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, importService.baseDir);
      },
      filename(req, file, cb) {
        // to prevent hashing the file name. files with same name will be overwritten.
        cb(null, file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (path.extname(file.originalname) === '.zip') {
        return cb(null, true);
      }
      cb(new Error('Only ".zip" is allowed'));
    },
  });

  /**
   * defined overwrite params for each collection
   * all imported documents are overwriten by this value
   * each value can be any value or a function (_value, { _document, key, schema }) { return newValue }
   *
   * @param {object} Model instance of mongoose model
   * @param {object} req request object
   * @return {object} document to be persisted
   */
  const overwriteParamsFn = async(Model, schema, req) => {
    const { collectionName } = Model.collection;

    /* eslint-disable no-case-declarations */
    switch (Model.collection.collectionName) {
      case 'pages':
        // TODO: use schema and req to generate overwriteParams
        // e.g. { creator: schema.creator === 'me' ? ObjectId(req.user._id) : importService.keepOriginal }
        return {
          status: 'published', // FIXME when importing users and user groups
          grant: 1, // FIXME when importing users and user groups
          grantedUsers: [], // FIXME when importing users and user groups
          grantedGroup: null, // FIXME when importing users and user groups
          creator: ObjectId(req.user._id), // FIXME when importing users
          lastUpdateUser: ObjectId(req.user._id), // FIXME when importing users
          liker: [], // FIXME when importing users
          seenUsers: [], // FIXME when importing users
          commentCount: 0, // FIXME when importing comments
          extended: {}, // FIXME when ?
          pageIdOnHackmd: undefined, // FIXME when importing hackmd?
          revisionHackmdSynced: undefined, // FIXME when importing hackmd?
          hasDraftOnHackmd: undefined, // FIXME when importing hackmd?
        };
      // case 'revisoins':
      //   return {};
      // case 'users':
      //   return {};
      // ... add more cases
      default:
        throw new Error(`cannot find a model for collection name "${collectionName}"`);
    }
    /* eslint-enable no-case-declarations */
  };

  /**
   * @swagger
   *
   *  /import:
   *    post:
   *      tags: [Import]
   *      description: import a collection from a zipped json
   *      produces:
   *        - application/json
   *      responses:
   *        200:
   *          description: data is successfully imported
   *          content:
   *            application/json:
   */
  router.post('/', async(req, res) => {
    // TODO: add express validator

    const { fileName, collections, schema } = req.body;
    const zipFile = importService.getFile(fileName);

    // unzip
    await importService.unzip(zipFile);
    // eslint-disable-next-line no-unused-vars
    const { meta, fileStats } = await growiBridgeService.parseZipFile(zipFile);

    // filter fileStats
    const filteredFileStats = fileStats.filter(({ fileName, collectionName, size }) => { return collections.includes(collectionName) });

    // TODO: validate using meta data

    try {
      await Promise.all(filteredFileStats.map(async({ fileName, collectionName, size }) => {
        const Model = importService.getModelFromCollectionName(collectionName);
        const jsonFile = importService.getFile(fileName);

        let overwriteParams;
        if (overwriteParamsFn[collectionName] != null) {
          // await in case overwriteParamsFn[collection] is a Promise
          overwriteParams = await overwriteParamsFn(Model, schema[collectionName], req);
        }

        await importService.import(Model, jsonFile, overwriteParams);
      }));

      // TODO: use res.apiv3
      return res.send({ ok: true });
    }
    catch (err) {
      // TODO: use ApiV3Error
      logger.error(err);
      return res.status(500).send({ status: 'ERROR' });
    }
  });

  router.post('/upload', uploads.single('file'), async(req, res) => {
    const { file } = req;
    const zipFile = importService.getFile(file.filename);

    try {
      const data = await growiBridgeService.parseZipFile(zipFile);

      // TODO: use res.apiv3
      return res.send({
        ok: true,
        file: file.filename,
        data,
      });
    }
    catch (err) {
      // TODO: use ApiV3Error
      logger.error(err);
      return res.status(500).send({ status: 'ERROR' });
    }
  });

  return router;
};
