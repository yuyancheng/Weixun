'use strict';
app.controller('OrgAttendance', function($rootScope, $scope, $state, $stateParams) {
  //var url = app.url.org.api.list;
  var url = app.url.org.attendance;
  $scope.onTime = new Date('2015/01/01 9:00:00');
  $scope.offTime = new Date('2015/01/01 18:00:00');
  $scope.hstep = 1;
  $scope.mstep = 5;
  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };
  $scope.ismeridian = false;
  $scope.toggleMode = function() {
    $scope.ismeridian = !$scope.ismeridian;
  };
  $scope.update = function() {
    var d = new Date();
    d.setHours(14);
    d.setMinutes(0);
    $scope.onTime = d;
    $scope.offTime = d;
  };
  $scope.changed = function() {
    console.log('OnTime is: ' + $scope.onTime);
    console.log('OffTime is: ' + $scope.offTime);
  };
  $scope.clear = function() {
    $scope.onTime = null;
    $scope.offTime = null;
  };
  // 提交并添加数据
  $scope.submit = function() {
    app.utils.getData(url, $scope.formData, function(dt) {
      $state.reload('app.org');
      //$state.go('app.org.list');
    });
  };
});