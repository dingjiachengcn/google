
angular.module('Scanner', [])
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.startHidTest = function () {
      function onDeviceFound(devices) { }
      chrome.hid.getUserSelectedDevices({ "filters": [], "multiple": true }, onDeviceFound);
    }

    console.log("test");
  }]);