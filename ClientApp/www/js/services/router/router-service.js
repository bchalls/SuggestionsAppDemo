'use strict';

angular.module('suggestions.router', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('login', {
        url: '/',
        controller: 'LoginController',
        templateUrl: 'templates/login-page.html'
      })
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        params: {
          userId: ''
        }
      })
      .state('tab.suggestions', {
        url: '/suggestions',
        views: {
          'tab-suggestions': {
            controller: 'SuggestionsController',
            templateUrl: 'templates/tab-suggestions.html'
          }
        }
      })
      .state('tab.suggestions-detail', {
        url: '/suggestions/detail/:id',
        views: {
          'tab-suggestions': {
            templateUrl: 'templates/suggestion-detail.html',
            controller: 'SuggestionsDetailController'
          }
        }
      })
      .state('tab.liked', {
        url: '/liked',
        views: {
          'tab-liked': {
            controller: 'LikedController',
            templateUrl: 'templates/tab-suggestions.html'
          }
        }
      })
  });
