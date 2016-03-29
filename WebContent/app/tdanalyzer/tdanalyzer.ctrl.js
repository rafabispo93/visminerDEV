homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];
	$scope.types2 = [];

	thisCtrl.selectView = function(view) {
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}

	thisCtrl.loadTypes = function(tagId) {
		$http.get('TypeServlet', {params:{"action": "getAllByTree", "treeId": tagId}})
		.success(function(data) {
			console.log('found', data.length, ' types');
			console.log(data);
			$scope.types2 = data;
		});
	}

	thisCtrl.loadTypes($scope.selectedTag.uid);
});