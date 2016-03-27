var homeApp = angular.module('homeApp', ['ngStorage', 'ngRoute', 'ui.bootstrap', 'checklist-model']);

homeApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
 	
    $routeProvider.
    when('/', {
        templateUrl: 'app/tdevolution/tdevolution.html',
        controller: 'HomeCtrl'
      }).
			when('/tdevolution', {
		    templateUrl: 'app/tdevolution/tdevolution.html',
		    controller: 'TDEvolutionCtrl'
		      }).
			when('/tdanalyzer', {
		    templateUrl: 'app/tdanalyzer/tdanalyzer.html',
		    controller: 'TDAnalyzerCtrl'
		      }).
			when('/committers', {
		    templateUrl: 'app/committers/committers.html',
		    controller: 'CommittersCtrl'
		      }).
			otherwise({ redirectTo: '/tdevolution' });
			$locationProvider.html5Mode(true);
  }]);

homeApp.controller('HomeCtrl', function ($scope, $timeout, $http, $sessionStorage, $location) {
  // This controller instance
  var thisCtrl = this;
  // Data collections
  $scope.commits = [];
  $scope.committers = [];
  $scope.repository = null;
  $scope.repositories = [];
  $scope.trees = [];
  $scope.tags = [];
  $scope.committerEvolution = [];
  $scope.currentPage = "tdevolution";
  $scope.alertMessage = "";
  $scope.durationProgress = 1000;

  $scope.filtered = {
  	repository: null,
  	commits: [],
  	committers: [],
  	tags: [],
  	debts: ["CODE", "DESIGN"],
  }
  
  // Load all repositories
	thisCtrl.repositoriesLoad = function() { 
		console.log('repositoriesLoad');
		$http.get('RepositoryServlet', {params:{"action": "getAllByRepository"}})
		.success(function(data) {
			console.log('found', data.length, 'repositories');
			$scope.repositories = data;
		});
	}

	thisCtrl.repositoriesLoad();

	thisCtrl.selectView = function(view) {
		$scope.currentPage = view;
	}

	thisCtrl.selectRepository = function(repositoryUid) {
		$scope.filtered.repository = repositoryUid;
		thisCtrl.treesLoad(repositoryUid);
	}

	// Load all trees
	thisCtrl.treesLoad = function(repositoryUid) { 
		console.log('treesLoad', repositoryUid);
		// Load the repository info
		for (i in $scope.repositories) {
			if ($scope.repositories[i].uid == repositoryUid) {
				$scope.repository = $scope.repositories[i];
				$sessionStorage.repository = $scope.repository;
				continue;
			}
		}
		$http.get('TreeServlet', {params:{"action": "getAllByRepository", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'trees');
			$scope.trees = data;
			thisCtrl.tagsLoad(repositoryUid);
			thisCtrl.commitsLoad();
		});
	}

	// Load all tags (versions)
	thisCtrl.tagsLoad = function(repositoryUid) { 
		console.log('tagsLoad', repositoryUid);

		$http.get('TreeServlet', {params:{"action": "getAllTags", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'tags');
			$scope.tags = data;
		});
	}

  thisCtrl.selectDebt = function(debt) {
  	console.log('TD '+debt+ ' Selected');
  	var index = $.inArray(debt, $scope.filtered.debts);
  	if (index > -1) {
      $scope.filtered.debts.splice(index, 1);
  	} else {
      $scope.filtered.debts.push(debt);
  	}
  }

	thisCtrl.analyzeDebts = function() {
		var analyze = true;
		if ($scope.filtered.repository == null) {
		  $scope.alertMessage = "Please Select a Repository!";
		  analyze = false;
		} 
		else if ($scope.filtered.tags.length == 0) {
		  $scope.alertMessage = "Please Select What Versions Will be Analyzed!";
          analyze = false;
		} 
		else if ($scope.filtered.debts.length == 0) {
		  $scope.alertMessage = "Please Select What Technical Debts Will be Analyzed!";
		  analyze = false;
		}

		if (analyze) {
			$('#progressBarModal').modal('show');
		} else {
			$('#alertModal').modal('show');
		}
	}

	// Load all commits from all trees
	thisCtrl.commitsLoad = function() { 
		console.log('commitsLoad');
		$scope.commits = [];
		$http.get('CommitServlet', {params:{"action": "getAllByRepository", "repositoryId": '8a2f05794faef3fa8177707245b4599d473832b6'}})
		.success(function(data) {
			console.log('found', data.length, 'commits');
			$scope.commits = data;
			for (i in data) {
				$scope.committerEvolution.push({
					commit: data[i].name,
					committer: data[i].committer,
					date: new Date(data[i].date.$date),
					type: {
						CC: 0
					}
				})
				var committerFound = false;
				for (x in $scope.committers) {
					if ($scope.committers[x].email == data[i].committer.email) {
						committerFound = true;
						continue;
					}
				}
				if (committerFound == false) {
					$scope.committers.push(data[i].committer);
				}
			}
		});
  }
  
});