'use strict';

angular.module('copayApp.controllers').controller('IndexController', function($scope, go) {
  $scope.init = function() {

  };

  $scope.swipe = function(invert) {
    go.swipe(invert);
  };

});
