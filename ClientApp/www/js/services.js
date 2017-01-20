angular.module('suggestions.services', [])

.factory('FHSync', function ($window, $q, $log, $rootScope, SYNC_DATASETS, SYNC_FREQUENCY) {

  var sync = {};

  /**
   * Performs all our FH.Sync initialisation calls
   * @return {undefined}
   */
  sync.init = function () {
    // Initialise sync and tell it to use window.localStorage for persistence
    $window.$fh.sync.init({
      storage_strategy : 'dom',
    });

    // Manage the "users" dataset, this will allow bi-directional data flow
    // from client to cloud
    SYNC_DATASETS.forEach(function (dataset) {
      $window.$fh.sync.manage(dataset, {
        sync_frequency: SYNC_FREQUENCY
      }, {}, {}, function () {
        $log.info('"' + dataset + '" dataset now managed by sync framework');
      });
    });

    // Handle events that sync emits
    $window.$fh.sync.notify(onNotify);
  };

  /**
   * List items in a given dataset name
   * @param  {String}   dataset
   * @return {Promise}
   */
  sync.doList = function (dataset) {
    var defer = $q.defer();

    $window.$fh.sync.doList(dataset, defer.resolve, defer.reject);

    return defer.promise;
  };

  sync.doUpdate = function (dataset, id, data) {
    var defer = $q.defer();

    $window.$fh.sync.doUpdate(dataset, id, data, defer.resolve, defer.reject);

    return defer.promise;
  };

  sync.doCreate = function (dataset, data) {
    var defer = $q.defer();

    $window.$fh.sync.doCreate(dataset, data, defer.resolve, defer.reject);

    return defer.promise;
  };

  sync.doDelete = function (dataset, id) {
    var defer = $q.defer();

    $log.info('delete', dataset, id);
    $window.$fh.sync.doDelete(dataset, id, defer.resolve, defer.reject);

    return defer.promise;
  };

  /**
   * Receives events from FH.Sync and uses $broadcast to let application
   * components know they have been emitted
   * @param  {Object} evt
   */
  function onNotify (evt) {
    $rootScope.$broadcast('fh.sync.notify', evt);
  }

  return sync;
});
