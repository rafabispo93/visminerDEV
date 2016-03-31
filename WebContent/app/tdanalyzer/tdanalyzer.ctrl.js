homeApp = angular.module('homeApp');

homeApp.controller('TDAnalyzerCtrl', function($scope, $http, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.committers = sidebarService.getCommitters();
	$scope.filtered.debts = sidebarService.getDebts();
	$scope.selectedTag = $scope.filtered.tags[0];
	$scope.types = [];
	$scope.currentDesignDebt = null;
	$scope.currentCodeDebt = null;

	thisCtrl.selectView = function(view) {
		$scope.currentPage = view;
		sidebarService.setCurrentPage(view);
	}

	thisCtrl.loadTypes = function(tagId) {
		$http.get('TypeServlet', {params:{"action": "getAllByTree", "treeId": tagId}})
		.success(function(data) {
			console.log('found', data.length, ' types'); 
			for (var i = 0; i < data.length; i++) {
				var hasDebt = thisCtrl.hasDebt(data[i].technicaldebts);
				if (hasDebt) {
					$scope.types.push(data[i]);
				}				
			}
		});
	}

	thisCtrl.hasDebt = function(debtsList) {
		var hasDebt = false;
		if (debtsList.length > 0) {
			for (var j = 0; j < debtsList.length; j++) {
				if (debtsList[j].name == 'Code Debt' && $.inArray('CODE', $scope.filtered.debts) > -1 && debtsList[j].value) {
					hasDebt = true;
				}
				if (debtsList[j].name == 'Design Debt'  && $.inArray('DESIGN', $scope.filtered.debts) > -1 && debtsList[j].value) {
					hasDebt = true;
				}
			}			
		}
		return hasDebt;
	}

	thisCtrl.loadTypes($scope.selectedTag.uid);

	$scope.loadCurrentDebts = function(type) {
		console.log('Entrou no currentTD: ', type);
		var tdList = type.technicaldebts;
		for (var i = 0; i < tdList.length; i++) {
			if (tdList[i].name == 'Code Debt') {
				$scope.currentCodeDebt = tdList[i];
			}
			if (tdList[i].name == 'Design Debt') {
				$scope.currentDesignDebt = tdList[i];
			}
		}
	}

	$scope.confirmSingleDebt = function(commitId, fileId, debt) {
		console.log('Debt Confirmed: ', debt); 		
		$http.get('TypeServlet', {params:{"action": "confirmSingleDebt",
		 "commitId": commitId, "fileId": fileId, "debt": debt}})
		.success(function() {
			console.log('Debt Confirmed: ', debt); 			
		});
	}

		$scope.removeSingleDebt = function(commitId, fileId, debt) {
		console.log('Debt Confirmed: ', debt); 		
		$http.get('TypeServlet', {params:{"action": "removeSingleDebt",
		 "commitId": commitId, "fileId": fileId, "debt": debt}})
		.success(function() {
			console.log('Debt Confirmed: ', debt); 			
		});
	}

});