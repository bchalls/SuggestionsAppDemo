var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var log = require('fh-bunyan').getLogger(__filename);

var $fh = require('fh-mbaas-api');

var collectionName = "suggestion";

var Joi = require('joi');

var schema = Joi.object().keys({
  approved: Joi.boolean(),
  approver: Joi.string().allow(''),
  approveDate: Joi.date().allow(''),
  createDate: Joi.date(),
  creator: Joi.string(),
  title: Joi.string().required(),
  desc: Joi.string(),
  yays: Joi.array().required(),
  nays: Joi.array().required()
})

function convertSingleToSyncFormat(dbResponse) {

  var syncResponse = {}

  syncResponse[dbResponse.guid] = dbResponse.fields;

  return syncResponse;
}

function convertListToSyncFormat(dbResponse) {

  var syncResponse = {};

  for (var idx in dbResponse.list) {

    var item = dbResponse.list[idx];
    syncResponse[item.guid] = item.fields;

  }

  return syncResponse;
}

function suggestionsRoute() {

  var suggestions = new express.Router();
  suggestions.use(cors());
  suggestions.use(bodyParser());

  // GET REST endpoint - query params may or may not be populated
  suggestions.get('/', function(req, res) {
    // data in query string
    log.debug('In suggestions route GET / req.query=' + req.query);
    log.debug("req.query.approved=" + req.query.approved);

    // List
    var options = {
      "act": "list",
      "type": collectionName, // Entity/Collection name
    };

    if (Object.keys(req.query).length) {
      if (req.query.approved !== undefined) {
        req.query.approved = (req.query.approved === 'true'); // convert from string to boolean
      }
      options.eq = req.query;
    }

    $fh.db(options, function(err, data) {
      if (err) {
        log.error("Error " + err);

        res.json({
          msg: err
        });
      } else {
        log.debug(JSON.stringify(data));

        var output = convertListToSyncFormat(data);

        log.debug("syncFormat: " + JSON.stringify(output));
        res.json(output);
      }
    });

  });

  suggestions.get('/:id', function(req, res) {
    log.debug('In suggestions route GET / req.body=' + req.body);

    var theGuid = req.params.id;
    log.debug("theGuid=" + theGuid);

    var options = {
      "act": "read",
      "type": collectionName, // Entity/Collection name
      "guid": theGuid // Row/Entry ID
    };

    $fh.db(options, function(err, data) {
      if (err) {
        log.error("Error " + err);

        res.json({
          msg: err
        });
      } else {
        log.debug(JSON.stringify(data));

        var output = convertSingleToSyncFormat(data);

        log.debug("syncFormat: " + JSON.stringify(output));
        res.json(output);

      }
    });

  });

  suggestions.post('/', function(req, res) {
    log.debug('>> In suggestions route POST / req.body=' + req.body);

    // Create a single entry/row
    var options = {
      "act": "create",
      "type": collectionName,
      "fields": req.body
    };

    // validate
    Joi.validate(req.body, schema, function(theError) {

      if (theError !== null) {
        log.error(JSON.stringify(theError));
        res.json({
          msg: theError
        });
      } else {
        $fh.db(options, function(err, data) {
          if (err) {
            log.error("Error " + err);

            res.json({
              msg: err
            });

          } else {
            log.debug(JSON.stringify(data));

            var output = convertSingleToSyncFormat(data);

            log.debug("syncFormat: " + JSON.stringify(output));
            res.json(output);
          }
        });
      }
    });
  });

  suggestions.put('/:id', function(req, res) {
    log.debug('In suggestions route PUT / req.body=' + req.body);

    var theGuid = req.params.id;
    log.debug("theGuid=" + theGuid);

    var options = {
      "act": "update",
      "type": collectionName, // Entity/Collection name
      "guid": theGuid, // Row/Entry ID
      "fields": req.body
    };

    // validate
    Joi.validate(req.body, schema, function(theError) {

      if (theError !== null) {
        log.error(JSON.stringify(theError));
        res.json({
          msg: theError
        });
      } else {

        $fh.db(options, function(err, data) {
          if (err) {
            log.error("Error " + err);

            res.json({
              msg: err
            });
          } else {
            log.debug(JSON.stringify(data));

            var output = convertSingleToSyncFormat(data);

            log.debug("syncFormat: " + JSON.stringify(output));
            res.json(output);
          }
        });
      }
    });
  });

  suggestions.delete('/:id', function(req, res) {
    log.debug('In suggestions route DELETE / req.body=' + req.body);

    var theGuid = req.params.id;
    log.debug("theGuid=" + theGuid);

    var options = {
      "act": "delete",
      "type": collectionName, // Entity/Collection name
      "guid": theGuid // Row/Entry ID
    };

    $fh.db(options, function(err, data) {
      if (err) {
        log.error("Error " + err);

        res.json({
          msg: err
        });
      } else {
        log.debug(JSON.stringify(data));

        var output = convertSingleToSyncFormat(data);

        log.debug("syncFormat: " + JSON.stringify(output));
        res.json(output);
      }
    });

  });

  return suggestions;
}

module.exports = suggestionsRoute;
