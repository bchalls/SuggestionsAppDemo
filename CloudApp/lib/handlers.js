var $fh = require('fh-mbaas-api');
var log = require('fh-bunyan').getLogger(__filename);
var VError = require('verror');

var service_guid = 'nfrip5ijqakd3ktya23bwaup';
var path_root = '/suggestions';

module.exports.list = function(dataset_id, cb, meta_data) {
  $fh.service({
      "guid": service_guid,
      "path": path_root, //the path part of the url excluding the hostname - this will be added automatically
      "method": "GET"
    },
    function(err, body, res) {
      log.debug('statuscode: ', res && res.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        cb(new VError('Failed to call GET on ' + path_root));
      } else if (res.statusCode === 200) {
        log.info('Status code was 200 with body.fields', body);
        cb(null, body);
      } else {
        cb(new VError('Non 200 status received from GET on ' + path_root))
      }
    });
};

module.exports.create = function(dataset_id, data, cb, meta_data) {
  log.info('Creating with data: ', data);
  $fh.service({
      "guid": service_guid,
      "path": path_root, //the path part of the url excluding the hostname - this will be added automatically
      "method": "POST", //all other HTTP methods are supported as well. for example, HEAD, DELETE, OPTIONS
      "params": data
    },
    function(err, body, res) {
      log.debug('statuscode: ', res && res.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        cb(new VError('Failed to call POST on ' + path_root));
      } else if (res.statusCode === 200) {
        log.info('Status code was 200 with body', body);
        cb(null, body);
      } else {
        cb(new VError('Non 200 status received from POST on ' + path_root))
      }
    });
};

module.exports.read = function(dataset_id, guid, cb, meta_data) {
  $fh.service({
      "guid": service_guid,
      "path": path_root + '/' + guid, //the path part of the url excluding the hostname - this will be added automatically
      "method": "GET"
    },
    function(err, body, res) {
      log.debug('statuscode: ', res && res.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        cb(new VError('Failed to call GET on ' + path_root));
      } else if (res.statusCode === 200) {
        log.info('Status code was 200 with body', body);
        cb(null, body);
      } else {
        cb(new VError('Non 200 status received from GET on ' + path_root))
      }
    });
};

module.exports.update = function(dataset_id, guid, data, cb, meta_data) {
  log.info('Calling update on ' + guid + ' with: ', data)
  $fh.service({
      "guid": service_guid,
      "path": path_root + '/' + guid, //the path part of the url excluding the hostname - this will be added automatically
      "method": "PUT", //all other HTTP methods are supported as well. for example, HEAD, DELETE, OPTIONS
      "params": data
    },
    function(err, body, res) {
      log.debug('statuscode: ', res && res.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        cb(new VError('Failed to call PUT on ' + path_root));
      } else if (res.statusCode === 200) {
        log.info('Status code was 200 with body.fields', bodys);
        cb(null, body);
      } else {
        cb(new VError('Non 200 status received from PUT on ' + path_root))
      }
    });
};

module.exports.delete = function(dataset_id, guid, cb, meta_data) {
  $fh.service({
      "guid": service_guid,
      "path": path_root + '/' + guid, //the path part of the url excluding the hostname - this will be added automatically
      "method": "DELETE"
    },
    function(err, body, res) {
      log.info('DELETE statuscode: ', res && res.statusCode);
      if (err) {
        // An error occurred during the call to the service. log some debugging information
        cb(new VError('Failed to call DELETE on ' + path_root));
      } else if (res.statusCode === 200) {
        log.info('Status code was 200 with body', body);
        cb(null, body);
      } else {
        cb(new VError('Non 200 status received from DELETE on ' + path_root))
      }
    });
};
