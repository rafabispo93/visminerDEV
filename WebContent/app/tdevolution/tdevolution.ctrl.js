homeApp = angular.module('homeApp');

homeApp.controller('TDEvolutionCtrl', function($scope, $http, $q, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.tags = [];

	$scope.latestTag = {
		tag: null,
		types: [],
		totalSmells: 0,
		totalDebts: 0
	};

		$scope.earliestTag = {
		tag: null,
		types: [],
		totalSmells: 0,
		totalDebts: 0
	};
	
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.debts = sidebarService.getDebts();

	thisCtrl.loadEvolutionInformation = function(repository) {
		if (repository) {
			thisCtrl.tagsLoad(repository.uid);
			$http.get('TreeServlet', {params:{"action": "getLatestTag", "repositoryId": repository.uid}})
			.success(function(data) {
				console.log('Latest tag found:', data); 																													
			});
		}	
	}

	// Load all tags (versions)
	thisCtrl.tagsLoad = function(repositoryUid) { 
		console.log('tagsLoad=', repositoryUid);

		 $http.get('TreeServlet', {params:{"action": "getAllTags", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'tags');
			$scope.tags = data;
			var latestRequest = thisCtrl.setLatestTag($scope.latestTag, $scope.tags.length-1);
			$q.all([latestRequest]).then(function() { 
        thisCtrl.setEarliestTag($scope.earliestTag, 0);
    	});
			thisCtrl.loadSlider();
		});
	}

	thisCtrl.setLatestTag = function(tag, position) {
			tag.tag = $scope.tags[position];
			return thisCtrl.getAllTypesByTag(tag, tag.tag.uid);
	}

	thisCtrl.setEarliestTag = function(tag, position) {
			tag.tag = $scope.tags[position];
			thisCtrl.getAllTypesByTag(tag, tag.tag.uid);
	}

	thisCtrl.getAllTypesByTag = function(tag, treeId) {
		return $http.get('TypeServlet', {params:{"action": "getAllByTree", "treeId": treeId}})
		.success(function(data) {
			console.log('Types from Latest tag found:', data); 																													
			tag.types = data;
			thisCtrl.getTotalOfCodeSmells(tag, tag.types);
			thisCtrl.getTotalOfDebts(tag, tag.types);
		});
	}

	thisCtrl.getTotalOfCodeSmells = function(tag, types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			for (var j = 0; j < types[i].antipatterns.length; j++) {
				if (types[i].antipatterns[j].value) {
					total++;
				}
			}
		}	
		tag.totalSmells = total;
	}

		thisCtrl.getTotalOfDebts = function(tag, types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			for (var j = 0; j < types[i].technicaldebts.length; j++) {
				if (types[i].technicaldebts[j].value) {
					total++;
				}
			}
		}	
		tag.totalDebts = total;
	}

	thisCtrl.loadSlider = function() {
		$scope.slider = {
        minValue: 1,
        maxValue: $scope.tags.length,
        options: {
            ceil: $scope.tags.length,
            floor: 1,
            showTicksValues: true,
            draggableRange: true,
            onChange: function () {
            		console.log("ENTROU NO ONCHANGE");
            		var latestRequest = thisCtrl.setLatestTag($scope.latestTag, $scope.slider.maxValue-1);
            		$q.all([latestRequest]).then(function() { 
					        thisCtrl.setEarliestTag($scope.earliestTag, $scope.slider.minValue-1);
					    	});
            },
            translate: function (value) {
                return $scope.tags[value-1].name;
            }
        }
  	};
	}

	thisCtrl.loadEvolutionInformation($scope.filtered.repository); 

});