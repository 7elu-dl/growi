// crowi-fileupload-gridFS

module.exports = function(crowi) {
  'use strict';

  var debug = require('debug')('growi:service:fileUploadergridfs')
  var logger = require('@alias/logger')('growi:routes:attachment')
  var mongoose = require('mongoose');
  var path = require('path');
  var fs = require('fs');
  var lib = {};
  var Attachment = crowi.model('Attachment');
  var AttachmentFile = {};

  // instantiate mongoose-gridfs
  var gridfs = require('mongoose-gridfs')({
    collection: 'attachmentFiles',
    model: 'AttachmentFile',
    mongooseConnection: mongoose.connection
  });

  // obtain a model
  AttachmentFile = gridfs.model;

  // // delete a file
  // lib.deleteFile = async function(fileId, filePath) {
  //   debug('File deletion: ' + fileId);
  //   await AttachmentFile.unlinkById(fileId, function(error, unlinkedAttachment) {
  //     if (error) {
  //       throw new Error(error);
  //     }
  //   });
  // };

  lib.uploadFile = function(filePath, contentType, fileStream, options) {
    debug('File uploading: ' + filePath);
    return new Promise(function(resolve, reject) {
      AttachmentFile.write({filename: filePath, contentType: contentType}, fileStream,
        function(error, createdFile) {
          if (error) {
            reject(error);
          }
          resolve();
        });
    });
  };

  lib.findDeliveryFile = function(fileId, filePath) {
  //   const cacheFile = lib.createCacheFileName(fileId);

  //   debug('find delivery file', cacheFile);
  //   if (!lib.shouldUpdateCacheFile(cacheFile)) {
  //     return cacheFile;
  //   }

  //   const fileStream = fs.createWriteStream(cacheFile);
  //   const fileUrl = lib.generateUrl(filePath);
  //   debug('Load attachement file into local cache file', fileUrl, cacheFile);
  //   return cacheFile;
  // };

  // // private
  // lib.createCacheFileName = function(fileId) {
  //   return path.join(crowi.cacheDir, `attachment-${fileId}`);
  // };

  // // private
  // lib.shouldUpdateCacheFile = function(filePath) {
  //   try {
  //     const stats = fs.statSync(filePath);

  //     if (!stats.isFile()) {
  //       debug('Cache file not found or the file is not a regular fil.');
  //       return true;
  //     }

  //     if (stats.size <= 0) {
  //       debug('Cache file found but the size is 0');
  //       return true;
  //     }
  //   }
  //   catch (e) {
  //     // no such file or directory
  //     debug('Stats error', e); // [TODO] error log of bunyan logger
  //     return true;
  //   }

  //   return false;
  };

  lib.getFileData = async function(filePath) {
    const file = await lib.getFile(filePath);
    const id = file.id;
    const contentType = file.contentType;
    const data = await lib.readFileData(id);
    return {
      data,
      contentType
    };
  };

  lib.getFile = function(filePath) {
    return new Promise((resolve, reject) => {
      AttachmentFile.findOne({
        filename: filePath
      }, async function(err, file) {
        if (err) {
          reject(err);
        }
        resolve(file);
      });
    });
  };

  lib.readFileData = function(id) {
    return new Promise((resolve, reject) => {
      let buf;
      const stream = AttachmentFile.readById(id);
      stream.on('error', function(error) {
        reject(error);
      });
      stream.on('data', function(data) {
        if (buf) {
          buf = Buffer.concat([buf, data]);
        }
        else {
          buf = data;
        }
      });
      stream.on('close', function() {
        debug('GridFS readstream closed');
        resolve(buf);
      });
    });
  };

  lib.generateUrl = function(filePath) {
    return `/${filePath}`;
  };

  return lib;
};
