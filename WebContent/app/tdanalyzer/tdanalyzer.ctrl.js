homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];

	thisCtrl.selectView = function(view) {
		alert('AQUI');
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}
});