
var homeApp = angular.module('homeApp', ['ngStorage', 'ui.bootstrap']);

homeApp.controller('commitersCtrl', function() {
  this.commiter = {
    name: 'Spawn'
  };
});

var addManagerModal = function($scope, $modal) {
	$scope.open = function () {
	  var modalInstance = $modal.open({
      templateUrl: 'addManager.html',
      controller: ModalInstanceCtrl
    });
	};
};

var ModalInstanceCtrl = function ($scope, $modalInstance) {
  $scope.ok = function () {
    $modalInstance.close();
  };
  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};


homeApp.controller('HomeCtrl', function ($scope, $timeout, $http, $sessionStorage) {
	// This controller instance
  var thisCtrl = this;
  // Data collections
  thisCtrl.commiters = [];
  thisCtrl.commits = [];
  thisCtrl.repository = null;
  thisCtrl.repositories = [];
  thisCtrl.trees = [];

  // Load all trees
	thisCtrl.repositoriesLoad = function() { 
		console.log('repositoriesLoad');
		$http.get('RepositoryServlet', {params:{"action": "getAllByRepository"}})
		.success(function(data) {
			thisCtrl.repositories = data;
		});
	}
  
  // Load all trees
	thisCtrl.treesLoad = function(repositoryUid) { 
		console.log('treesLoad', repositoryUid);
		// Load the repository info
		for (i in thisCtrl.repositories) {
			if (thisCtrl.repositories[i].uid == repositoryUid) {
				thisCtrl.repository = thisCtrl.repositories[i];
				$sessionStorage.repository = thisCtrl.repository;
				continue;
			}
		}

		$http.get('TreeServlet', {params:{"action": "getAllByRepository", "repositoryId": repositoryUid}})
		.success(function(data) {
			thisCtrl.trees = data;
			thisCtrl.refreshValues();
			$scope.initSlider();
		});
	}

	// Load all commits from all trees
	thisCtrl.commitsLoad = function() { 
		console.log('commitsLoad');
		thisCtrl.commits = [];
		for (i in thisCtrl.trees) {
			for (x in thisCtrl.trees[i].commits) {
				var commitDate = new Date(thisCtrl.trees[i].commits[x].date);
				if ($sessionStorage.period.minSelected <= commitDate && $sessionStorage.period.maxSelected >= commitDate) {
					thisCtrl.commits.push(thisCtrl.trees[i].commits[x]);
				}
			}
		}
  }

  // Define initial values
  thisCtrl.refreshValues = function () { console.log('refreshValues');
  	$sessionStorage.period = '';
	  if (typeof $sessionStorage.period == 'undefined' || $sessionStorage.period == '') {
	  	console.log('-- Initial configuration --')
	  	var commits = [];
			for (i in thisCtrl.trees) {
				for (x in thisCtrl.trees[i].commits) {
					commits.push(thisCtrl.trees[i].commits[x]);
				}
			}
	  	var dateMin = '';
	  	var dateMax = '';
	  	for (i in commits) {
	  		var date = new Date(commits[i].date);
	  		if (dateMin == '') {
	  			dateMin = date;
	  		}
	  		if (dateMax == '') {
	  			dateMax = date;
	  		}
	  		if (date < dateMin) {
	  			dateMin = date;
	  		}
	  		else if (date > dateMax) {
	  			dateMax = date;
	  		}
	  	}
	    $sessionStorage.period = {
	      min: dateMin,
	      minSelected: dateMin,
	      max: dateMax,
	      maxSelected: dateMax
	    }
	  } else {
	  	$sessionStorage.period.min = new Date($sessionStorage.period.min);
	  	$sessionStorage.period.minSelected = new Date($sessionStorage.period.minSelected);
	  	$sessionStorage.period.max = new Date($sessionStorage.period.max);
	  	$sessionStorage.period.maxSelected = new Date($sessionStorage.period.maxSelected);
	  }
	  thisCtrl.commitsLoad();
  }

	thisCtrl.repositoriesLoad();

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };


	$scope.dateMin = new Date($sessionStorage.period.min);
	$scope.dateMax = new Date($sessionStorage.period.max);
	$scope.dateMinSelected = new Date($sessionStorage.period.minSelected);
	$scope.dateMaxSelected = new Date($sessionStorage.period.maxSelected);

	$scope.commiters = [];
	$scope.commits = [];
	$scope.classes = [];
	$scope.lines = 0;
	$scope.codeSmells = [];
	$scope.codeSmellsQtty = 0;

	$scope.sliderValueChanged = function(data) {
    $sessionStorage.period.minSelected = data.values.min;
    $sessionStorage.period.maxSelected = data.values.max;
		$scope.dateMinSelected = data.values.min;
		$scope.dateMaxSelected = data.values.max;
		thisCtrl.refreshValues();
	};

	$scope.getCodeSmellsAll = function() {
		var codeSmells = [];
		for (i in $scope.data.codeSmells) {
			codeSmells.push($scope.data.codeSmells[i]);
		}
		return codeSmells;
	}

	$scope.getCommitersAll = function() {
		var commiters = [];
		for (i in $scope.data.projects) {
			for (x in $scope.data.projects[i].commiters) {
				var projectMember = $scope.data.projects[i].commiters[x];
				var memberExist = false;
				for (z in commiters) {
					if (commiters[z].email == projectMember.email) {
						memberExist = true;
					}
				}
				if (memberExist == false){
					commiters.push(projectMember);
				}
			}
		}
		return commiters;
	}

	$scope.getCommits = function() {
		$scope.commits = [];
		for (i in $scope.data.projects) {
			for (x in $scope.data.projects[i].commits) {
				var commit = $scope.data.projects[i].commits[x];
				if (moment($scope.dateMinSelected).format('YYYYMMDD') <= moment(commit.date, "YYYY-MM-DD HH:mm").format('YYYYMMDD') && moment(commit.date, "YYYY-MM-DD HH:mm").format('YYYYMMDD') <= moment($scope.dateMaxSelected).format('YYYYMMDD'))
					$scope.commits.push(commit);
			}
		}
		$scope.getCommiters();
	}

	$scope.getCommiters = function() {
		var commiters = [];
		for (i in $scope.commits) {
			var memberExist = false;
			for (x in commiters) {
				if (commiters[x].email == $scope.commits[i].member) {
					memberExist = true;
				}
			}
			if (memberExist == false) {
				for (z in $scope.commitersAll) {
					if ($scope.commits[i].member == $scope.commitersAll[z].email) {
						commiters.push($scope.commitersAll[z]);
						break;
					}
				}
			}
		}
		$scope.commiters = commiters;
		$scope.getClasses();
	}

	$scope.getClasses = function() {
		$scope.classes = [];
		for (i in $scope.commits) {
			for (x in $scope.commits[i].classes) {
				$scope.classes.push($scope.commits[i].classes[x]);
			}
		}
		$scope.getLines();
	}

	$scope.getLines = function() {
		$scope.lines = 0;
		for (i in $scope.classes) {
			$scope.lines += $scope.classes[i].lines;
		}
		$scope.getCodeSmells();
	}

	$scope.getCodeSmells = function() {
		$scope.codeSmells = [];
		$scope.codeSmellsQtty = 0;
		for (i in $scope.commits) {
			for (x in $scope.commits[i].classes) {
				for (z in $scope.commits[i].classes[x].codeSmells) {
					var codeSmells = $scope.commits[i].classes[x].codeSmells[z];
					var codeSmellExist = false;
					for (c in $scope.codeSmells) {
						if ($scope.codeSmells[c].name == codeSmells.name) {
							codeSmellExist = true;
							break;
						}
					}
					if (codeSmellExist == false) {
						$scope.codeSmells.push(codeSmells);
					}
				}
			}
		}
		for (i in $scope.codeSmells) {
			$scope.codeSmellsQtty += $scope.codeSmells[i].qtty;
		}
	}

	$scope.getCodeSmellsByMember = function(type, email) {
		var total = 0;
		for (i in $scope.commits) {
			var commit = $scope.commits[i];
			if (commit.member == email) {
				for (x in commit.classes) {
					for (z in commit.classes[x].codeSmells) {
						if (commit.classes[x].codeSmells[z].name == type) {
							total += commit.classes[x].codeSmells[z].qtty;
						}
					}
				}
			}
		}
		return total;
	}

	$scope.initSlider = function() {
		if (typeof $scope.sliderLoaded == 'undefined' || $scope.sliderLoaded == false) {
			$("#slider").dateRangeSlider({
				symmetricPositionning: true,
				bounds: {
					min: $scope.dateMin,
					max: $scope.dateMax
				},
				defaultValues:{
					min: $scope.dateMinSelected,
					max: $scope.dateMaxSelected
				},
				range: {
				//min: {days: 1}
				},
				formatter:function(val){
					var days = val.getDate(),
						month = val.getMonth() + 1,
						year = val.getFullYear();
					return month + "/" + days + "/" + year;
				}
			}).bind("valuesChanging", function(e, data){
				$timeout(function(){ 
					$scope.sliderValueChanged(data); 
				});
			});
		}
		$scope.sliderLoaded = true;
	};

	$scope.changeSliderValues = function(min, max){
		$("#slider").dateRangeSlider("values", min, max);
	};

	$scope.changeSliderBounds = function(min, max){
		$("#slider").dateRangeSlider("bounds", min, max);
	};

	$scope.test = function(param){ console.log(param); };

	$scope.testChangeSliderValues = function(){
		$scope.changeSliderValues(new Date(2012, 1, 10), new Date(2012, 1, 11));
	};

	$scope.testChangeSliderBounds = function(){
		$scope.changeSliderBounds(new Date(2012, 1, 1), new Date(2012, 2, 28));
	};

	$http.get('public/js/data.json').success(function(data) {
		$scope.data = data;
		$scope.codeSmellsAll = $scope.getCodeSmellsAll();
		$scope.commitersAll = $scope.getCommitersAll();
		// $scope.refreshValues();
	});

});