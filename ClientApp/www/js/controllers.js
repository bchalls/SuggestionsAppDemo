angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, FHSync) {

  // View variables
  $scope.totalUsers = 0;
  $scope.latestLocalUpdateTs = 'Unknown';
  $scope.latestSyncToCloud = 'Unknown';

  // Initialise UI values
  refreshUi({});

  // Listen for sync changes
  $scope.$on('fh.sync.notify', refreshUi);

  // Refresh the UI when we display this page
  $scope.$on('$ionicView.enter', refreshUi);

  function refreshUi (scope, evt) {
    if (evt && evt.code === 'local_update_applied') {
      $scope.latestLocalUpdateTs = new Date().toString();
    }

    if (evt && evt.code === 'sync_complete') {
      $scope.latestSyncToCloud = new Date().toString();
    }

    FHSync.doList('users')
      .then(function (users) {
        $scope.totalUsers = Object.keys(users).length;
      });
  }
})

.controller('UsersCtrl', function($scope, $timeout, $ionicModal, $log, $window, FHSync) {

  // Users data, will be updated by fh.sync
  $scope.users = {};

  // Used to edit/create users
  $scope.modal = null;

  // Current user being viewed/edited
  $scope.workingUser = null;

  // When this page is loaded auto refresh the UI
  $scope.$on('$ionicView.enter', refreshUi);

  // When sync changes occur, auto update this list
  $scope.$on('fh.sync.notify', refreshUi);

  // Update a user based on inputs
  $scope.$on('modal.hidden', writeUserToSync);

  $scope.editUser = editUser;
  $scope.createUser = createUser;
  $scope.deleteUser = deleteUser;

  function createUser () {
    $scope.modalTitle = 'Create User';
    $scope.workingUser = {
      id: null,
      data: {
        firstname: '',
        lastname: ''
      }
    };

    showModal();
  }

  function editUser (data, id) {
    $scope.modalTitle = 'Edit User';
    $scope.workingUser = {
      id: id,
      data: data
    };

    showModal();
  }

  function deleteUser (id) {
    FHSync.doDelete('users', id);
  }

  function showModal () {
    $ionicModal.fromTemplateUrl('templates/user-detail.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
      modal.show();
    });
  }

  function writeUserToSync () {
    if ($scope.workingUser.id) {
      FHSync.doUpdate('users', $scope.workingUser.id, $scope.workingUser.data);
    } else {
      $scope.workingUser.data.createTs = new Date();
      FHSync.doCreate('users', $scope.workingUser.data);
    }
  }

  // Called on sync events and page load to ensure data is displayed
  function refreshUi () {
    $log.info('refreshing users list');

    FHSync.doList('users')
      .then(function (users) {
        $log.info('refreshed users list');
        $scope.users = users;
      })
      .catch(function (err) {
        $log.error('failed to refresh user list', err);
      });
  }

})

.controller('ChatDetailCtrl', function($scope, $stateParams) {

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
