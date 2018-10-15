// crowi-fileupload-gridFS

module.exports = function(crowi) {
  'use strict';

  var debug = require('debug')('growi:service:fileUploaderLocal')
  var fs = require('fs');
  var mongoose = require('mongoose');
  var gridfs = require('gridfs-stream');
  var path = require('path');
  var lib = {};

  mongoose.connect('mongodb://localhost/growi', {
    useNewUrlParser: true
  });
  mongoose.Promise = global.Promise;
  gridfs.mongo = mongoose.mongo;
  var connection = mongoose.connection;
  connection.on('error', console.error.bind(console, 'connection error:'));

  lib.uploadFile = function (filePath, contentType, fileStream, options) {
    debug('File uploading: ' + filePath);
    return new Promise(function (resolve, reject) {
      // connection.once('open', function () {
        var gfs = gridfs(connection.db);

        // Writing a file from local to MongoDB
        var writestream = gfs.createWriteStream({ filename: 'test.jpg' });
        fs.createReadStream("public/uploads/attachment/5bb73b688ea417589dbd503f/14e456e38cea76bbca34dfdab712b909.jpg").pipe(writestream);
        writestream.on('close', function (file) {
          resolve(file);
        });
      });
    // });
  };
  // // mongoose connect
  // mongoose.connect('mongodb://localhost/test');

  // // instantiate mongoose-gridfs
  // var gridfs = require('mongoose-gridfs')({
  //   collection: 'attachments',
  //   model: 'Attachment',
  //   mongooseConnection: mongoose.connection
  // });

  // // obtain a model
  // Attachment = gridfs.model;

  // // create or save a file
  // lib.uploadFile = function (filePath, contentType, fileStream, options) {
  //   Attachment.write({
  //     filePath: filePath,
  //     contentType: contentType
  //   },
  //     fs.createReadStream(fileStream.path),
  //     function (error, createdFile) {
  //       debug('Failed to upload ' + createdFile + 'to gridFS', error);
  //     });
  // };

  // for larger file size
  // read a file and receive a stream
  // var stream = Attachment.readById(objectid);

  // for smaller file size
  // // read a file and receive a buffer
  // Attachment.readById(objectid, function (error, buffer) {
  //   debug('Failed to read a file with ' + buffer, error);
  // });

  // // remove file details and its content from gridfs
  // Attachment.unlinkById(objectid, function (error, unlinkedAttachment) {
  //   debug('Failed to remove ' + unlinkedAttachment + 'in gridFS', error);
  // });
  lib.generateUrl = function (filePath) {
    return path.posix.join('/uploads', filePath);
  };

  return lib;
};
