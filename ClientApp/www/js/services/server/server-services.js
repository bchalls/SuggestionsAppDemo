angular.module('suggestions.fhservices', [])
  .factory('fhservices', function($log, $q) {
    var service = {};

    var policyId = 'FirstAndThirds';
    // Client App ID
    var clientToken = 'iqurhzqay67gjjdoeokmdccx';

    service.auth = function(username, password) {
      return $q(function(resolve, reject) {
        $fh.auth({
          "policyId": policyId, // name of auth policy to use - see link:{ProductFeatures}#administration[Auth Policies Administration] for details on how to configure an auth policy
          "clientToken": clientToken, // Your App ID
          "params": { // the parameters associated with the requested auth policy - see below for full details.
            "userId": username, // LDAP or Platform username
            "password": password // LDAP or Platform password
          }
        }, function(res) {
          var sessionToken = res.sessionToken;
          var authResponse = res.authResponse;
          resolve(res);
        }, function(msg, err) {
          var errorMsg = err.message;
          reject(errorMsg);
        });
      });
    }


    return service;
  });
