homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];

	thisCtrl.selectView = function(view) {
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}

	// thisCtrl.loadCommits = function(tagId) {
	// 	$http.get('CommitServlet', {params:{"action": "getAllByRepository", "repositoryId": '8a2f05794faef3fa8177707245b4599d473832b6'}})
	// 	.success(function(data) {
	// 		console.log('found', data.length, ' commits');
	// 		$scope.commits = data;
	// 	});
	// }

	// $scope.commits = thisCtrl.loadCommits(selectedTag);
});