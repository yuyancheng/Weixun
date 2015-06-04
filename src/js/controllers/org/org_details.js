'use strict';

app.controller('OrgDetails', function($rootScope, $scope, $state) {
	$scope.details = $rootScope.details;
/*	$scope.goBack = function(){
		$state.transitionTo('app.org', true);
	};*/
});