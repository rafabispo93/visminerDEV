homeApp.controller('HomeCtrl', function ($scope, $timeout, $http, $sessionStorage, $location, sidebarService) {
  // This controller instance
  var thisCtrl = this;
  // Data collections
  $scope.commits = [];
  $scope.committers = [];
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
		sidebarService.setCurrentPage(view);
	}

	thisCtrl.selectRepository = function(repository) {
		$scope.filtered.repository = repository;
		sidebarService.setRepository(repository);
		thisCtrl.treesLoad(repository.uid);
	}

	// Load all trees
	thisCtrl.treesLoad = function(repositoryUid) { 
		console.log('treesLoad=', repositoryUid);
		
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
		console.log('tagsLoad=', repositoryUid);

		$http.get('TreeServlet', {params:{"action": "getAllTags", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'tags');
			$scope.tags = data;
		});
	}

	// Load all commits from all trees
	thisCtrl.commitsLoad = function() { 
		console.log('commitsLoad');

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
				var index = $.inArray(data[i].committer, $scope.committers);
  			if (index == -1) {
  				$scope.committers.push(data[i].committer);
  				sidebarService.addCommitters(data[i].committer);
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
			$('#progressBarModal').on('hidden.bs.modal', function(e) {
				thisCtrl.selectView('tdanalyzer');
  	   	$location.path("/tdanalyzer");
        $("#sidebar-tdfilter").click(); 
  		});
		} else {
			$('#alertModal').modal('show');
		}
	}

});