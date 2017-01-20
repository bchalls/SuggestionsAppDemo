'use strict';

angular.module('suggestions')
  .controller('SuggestionsDetailController', function($scope, $log, $stateParams, FHSync, $rootScope) {
    $log.info('Suggestions Detail Controller Loaded');

    $log.info('In details page for ID', $stateParams.id);

    $log.info('Global userId: ', $rootScope.userId);

    var data = FHSync.doList('suggestions').then(function(res) {
        $log.info('Suggestions list: ', res);
        $scope.suggestion = res[$stateParams.id];
        $log.info('Got suggestion: ', $scope.suggestion);
      })
      .catch(function(err) {
        $log.error('There was an error calling doList');
      })
  });
