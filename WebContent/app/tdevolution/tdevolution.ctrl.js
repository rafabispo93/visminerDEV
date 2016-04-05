homeApp = angular.module('homeApp');

homeApp.controller('TDEvolutionCtrl', function($scope, $http, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.latestTag = {tag : null};
	$scope.latestTag.types = [];
	$scope.latestTag.totalSmells = 0;
	$scope.latestTag.totalDebts = 0;
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.debts = sidebarService.getDebts();

	thisCtrl.getLatestTagData = function(repository) {
		if (repository) {
			$http.get('TreeServlet', {params:{"action": "getLatestTag", "repositoryId": repository.uid}})
			.success(function(data) {
				console.log('Latest tag found:', data); 																													
				$scope.latestTag.tag = data;
				thisCtrl.getAllTypesByTag($scope.latestTag.tag.uid);
			});
		}	
	}

	thisCtrl.getAllTypesByTag = function(treeId) {
		$http.get('TypeServlet', {params:{"action": "getAllByTree", "treeId": treeId}})
		.success(function(data) {
			console.log('Types from Latest tag found:', data); 																													
			$scope.latestTag.types = data;
			thisCtrl.getTotalOfCodeSmells($scope.latestTag.types);
			thisCtrl.getTotalOfDebts($scope.latestTag.types);
		});
	}

	thisCtrl.getTotalOfCodeSmells = function(types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			for (var j = 0; j < types[i].antipatterns.length; j++) {
				if (types[i].antipatterns[j].value) {
					total++;
				}
			}
		}	
		$scope.latestTag.totalSmells = total;
	}

		thisCtrl.getTotalOfDebts = function(types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			for (var j = 0; j < types[i].technicaldebts.length; j++) {
				if (types[i].technicaldebts[j].value) {
					total++;
				}
			}
		}	
		$scope.latestTag.totalDebts = total;
	}

	thisCtrl.getLatestTagData($scope.filtered.repository); 

});