'use strict';

angular.module('suggestions')
	.controller('LoginController', function($scope, $rootScope, $log, $state, auth) {
		$log.info('Login controller loaded');
		$scope.doLogin = function(username, password) {
			$log.info('Logging in with username: ', username);
			var promise = auth.doLogin(username, password);
			promise.then(function resolveFunc(response) {

				$log.info('Authentication response: ', response);
				$state.go('tab.suggestions', {
					userId: response.userId
				});

			}, function rejectFunc(err) {

				$log.info('Rejected authentication with : ', err);
			});

		}

	})
