var $fh = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = $fh.mbaasExpress();
var cors = require('cors');
var log = require('fh-bunyan').getLogger(__filename);

// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = [''];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

$fh.sync.init('suggestions', {}, function(err) {
  if (err) {
    log.error('ERROR: ', err);
  } else {
    $fh.sync.handleList('suggestions', require('./lib/handlers.js').list);
    $fh.sync.handleCreate('suggestions', require('./lib/handlers.js').create);
    $fh.sync.handleRead('suggestions', require('./lib/handlers.js').read);
    $fh.sync.handleUpdate('suggestions', require('./lib/handlers.js').update);
    $fh.sync.handleDelete('suggestions', require('./lib/handlers.js').delete);
  }
})

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
  console.log("App started at: " + new Date() + " on port: " + port);
});
