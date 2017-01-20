'use strict';

describe('auth service tests', function() {
  var authResponse;
  var failedResponse;

  beforeEach(module('rhmobile.auth'));

  beforeEach(module(function($provide) {
    $provide.service('fhservices', function() {
      var service = {};

      service.auth = function(username, password) {
        var success = {
          "message": "Authentication successful",
          "sessionToken": "ac26ciuqaqgjph6pzjk3x2dr",
          "status": "ok",
          "userId": "bhalls@redhat.com"
        };
        var failed = {
          "message": "User login failed: Incorrect password",
          "status": "error"
        };

        var response = {};

        if (username == 'testUser' && password == 'testPass') {
          response = success;
        } else {
          response = failed;
        }
        return Q.when(response);
      }
      return service;
    });
  }));

  beforeEach(function(done) {
    var auth = getService('auth');
    auth.doLogin('testUser', 'testPass')
      .then(function(response) {
        authResponse = response;
        done();
      });
  });

  beforeEach(function(done) {
    var auth = getService('auth');
    auth.doLogin('invalid', 'invalid')
      .then(function(response) {
        failedResponse = response;
        done();
      });
  });

  it('should get Authentication successfully', function() {
    expect(authResponse.status).toEqual('ok');
  });

  it('should not get Authentication successfully', function() {
    expect(failedResponse.status).toEqual('error');
  });
});
