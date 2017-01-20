'use strict';

angular.module('suggestions')
  .controller('SuggestionsController', function($scope, $state, $rootScope, $ionicPopup,
    FHSync, $stateParams, $log) {

    $log.info("Suggestions controller loaded");

    // Suggestions data, will be updated by fh.sync
    $scope.suggestions = {};

    // Current suggestion being viewed/edited
    $scope.selectedSuggestion = null;

    // When this page is loaded auto refresh the UI
    $scope.$on('$ionicView.enter', refreshUi);

    // When sync changes occur, auto update this list
    $scope.$on('fh.sync.notify', refreshUi);

    $rootScope.userId = $stateParams.userId;
    $log.info('Setting global userId to: ', $rootScope.userId);

    $scope.createSuggestion =
      createSuggestion;
    $scope.deleteSuggestion = deleteSuggestion;
    $scope.doLogout = doLogout;
    $scope.downvote = downvote;
    $scope.upvote = upvote;

    var userId = $rootScope.userId;

    function doLogout() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Log Out',
        template: 'Are you sure you want to log out?'
      });

      confirmPopup.then(function(res) {
        if (res) {
          console.log('Logged out');
          $state.go('login');
        } else {
          console.log('Not logged out');
        }
      });
    };

    function deleteSuggestion(id) {
      FHSync.doDelete('suggestions', id);
    }

    function writeSuggestionToSync() {
      if ($scope.selectedSuggestion.id != null) {
        FHSync.doUpdate('suggestions', $scope.selectedSuggestion.id, $scope.selectedSuggestion.data);
      } else {
        FHSync.doCreate('suggestions', $scope.selectedSuggestion.data);
      }
    }

    function updateSuggestion(suggestion) {
      FHSync.doUpdate('suggestions', suggestion.id, suggestion.data);
    }

    // Called on sync events and page load to ensure data is displayed
    function refreshUi() {
      $log.info('Refreshing suggestions list');

      FHSync.doList('suggestions')
        .then(function(suggestions) {
          $log.info('Refreshed suggestions list');
          $scope.suggestions = suggestions;
        })
        .catch(function(err) {
          $log.error('Failed to refresh suggestions list', err);
        });
    }

    function getSelection(id) {
      var result = FHSync.doList('suggestions')
      $log.info('Result.value', result);
      return result;
    }


    function createSuggestion() {
      // An elaborate, custom popup
      var myPopup = $ionicPopup.show({
        template: ' Enter Suggestions Title<input type="title" ng-model="suggestions.title">' +
          '<br> Enter Description<input type="description" ng-model="suggestions.desc" > ',
        title: 'Tell us your suggestion!',
        subTitle: 'We would looooooove to hear it',
        scope: $scope,
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            $scope.selectedSuggestion = {
              id: null,
              data: {
                approved: false,
                approver: '',
                approveDate: '',
                createDate: new Date().toString(),
                creator: userId,
                title: $scope.suggestions.title,
                desc: $scope.suggestions.desc,
                yays: [],
                nays: []
              }
            }
            writeSuggestionToSync();
          }
        }]
      })
    };

    function downvote(id) {
      var obj = $scope.suggestions[id].data;
      var added = obj.nays.pushIfNotExist(userId, function(e) {
        return e === userId;
      })
      if (added) {
        getSelection(id).then(function(res) {
            var result = {
              "id": id,
              "data": res[id].data
            };
            updateSuggestion(result);
          })
          .catch(function(err) {
            $log.error('There was an error calling doList');
          });

      }
    };

    function upvote(id) {
      var obj = $scope.suggestions[id].data;
      var added = obj.yays.pushIfNotExist(userId, function(e) {
        return e === userId;
      })
      if (added) {
        getSelection(id).then(function(res) {
            var result = {
              "id": id,
              "data": res[id].data
            };
            updateSuggestion(result);
          })
          .catch(function(err) {
            $log.error('There was an error calling doList');
          });
      }
    };

    // check if an element exists in array using a comparer function
    // comparer : function(currentElement)
    Array.prototype.inArray = function(comparer) {
      for (var i = 0; i < this.length; i++) {
        if (comparer(this[i])) return true;
      }
      return false;
    };

    // adds an element to the array if it does not already exist using a comparer
    // function
    Array.prototype.pushIfNotExist = function(element, comparer) {
      if (!this.inArray(comparer)) {
        this.push(element);
        return true;
      } else {
        return false;
      }
    };

  });
