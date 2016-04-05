homeApp.controller('HomeCtrl', function ($scope, $timeout, $http,
 $sessionStorage, $location, $route, sidebarService, alertModalService) {
  // This controller instance
  var thisCtrl = this;
  // Data collections
  $scope.commits = [];
  $scope.committers = [];
  $scope.repositories = [];
  $scope.tags = [];
  $scope.committerEvolution = [];
  $scope.currentPage = "tdevolution";
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
		sidebarService.setCurrentPage(view);
	}

	thisCtrl.selectRepository = function(repository) {
		$scope.filtered.repository = repository;
		sidebarService.setRepository(repository);
		$route.reload();
		thisCtrl.tagsLoad(repository.uid);
	}

	// Load all tags (versions)
	thisCtrl.tagsLoad = function(repositoryUid) { 
		console.log('tagsLoad=', repositoryUid);

		$http.get('TreeServlet', {params:{"action": "getAllTags", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'tags');
			$scope.tags = data;
			thisCtrl.commitsLoad(repositoryUid);
		});
	}

	// Load all commits from all trees
	thisCtrl.commitsLoad = function(repositoryUid) { 
		console.log('commitsLoad');

		$http.get('CommitServlet', {params:{"action": "getAllByRepository", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'commits');
			$scope.commits = data;
			for (var i in data) {
				$scope.committerEvolution.push({
					commit: data[i].name,
					committer: data[i].committer,
					date: new Date(data[i].date.$date),
					type: {
						CC: 0
					}
				})
				var index = $.inArray(data[i].committer, $scope.committers);
  			if (index == -1) {
  				$scope.committers.push(data[i].committer);
  				sidebarService.addCommitter(data[i].committer);
		  	}
			}
		});
  }

  thisCtrl.selectDebt = function(debt) {
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
		  alertModalService.setMessage("Please Select a Repository!");
		  analyze = false;
		} 
		else if ($scope.filtered.tags.length == 0) {
		  alertModalService.setMessage("Please Select What Versions Will be Analyzed!");
      analyze = false;
		} 
		else if ($scope.filtered.debts.length == 0) {
		  alertModalService.setMessage("Please Select What Technical Debts Will be Analyzed!");
		  analyze = false;
		}

		if (analyze) {
			
			$('#progressBarModal').modal('show');
			$('#progressBarModal').on('hidden.bs.modal', function(e) {
				thisCtrl.selectView('tdanalyzer');
  	   	$location.path("/tdanalyzer");
        $route.reload();
  		});
		} else {
			$('#alertModal').modal('show');
		}
	}

});