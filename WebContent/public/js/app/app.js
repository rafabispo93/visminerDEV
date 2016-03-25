var homeApp = angular.module('homeApp', ['ngStorage', 'ui.bootstrap', 'checklist-model']);

homeApp.controller('HomeCtrl', function ($scope, $timeout, $http, $sessionStorage) {
	// This controller instance
  var thisCtrl = this;
  // Data collections
  thisCtrl.commits = [];
  thisCtrl.committers = [];
  thisCtrl.repository = null;
  thisCtrl.repositories = [];
  thisCtrl.trees = [];
  thisCtrl.tags = [];
  thisCtrl.committerEvolution = [];

  thisCtrl.filtered = {
  	commits: [],
  	committers: [],
  	tags: [],
  	debts: ["CODE", "DESIGN"],
  }
  thisCtrl.page = "tdevolution";

  thisCtrl.selectDebt = function(debt) {
  	console.log('debt '+debt+ 'selected');
  	var index = $.inArray(debt, thisCtrl.filtered.debts);
  	if (index > -1) {
      thisCtrl.filtered.debts.splice(index, 1);
  	} else {
      thisCtrl.filtered.debts.push(debt);
  	}
  }

  // Load all repositories
	thisCtrl.repositoriesLoad = function() { 
		console.log('repositoriesLoad');
		$http.get('RepositoryServlet', {params:{"action": "getAllByRepository"}})
		.success(function(data) {
			console.log('found', data.length, 'repositories');
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
			console.log('found', data.length, 'trees');
			thisCtrl.trees = data;
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
			thisCtrl.tags = data;
		});
	}

	// Load all commits from all trees
	thisCtrl.commitsLoad = function() { 
		console.log('commitsLoad');
		thisCtrl.commits = [];
		$http.get('CommitServlet', {params:{"action": "getAllByRepository", "repositoryId": '8a2f05794faef3fa8177707245b4599d473832b6'}})
		.success(function(data) {
			console.log('found', data.length, 'commits');
			thisCtrl.commits = data;
			for (i in data) {
				thisCtrl.committerEvolution.push({
					commit: data[i].name,
					committer: data[i].committer,
					date: new Date(data[i].date.$date),
					type: {
						CC: 0
					}
				})
				var committerFound = false;
				for (x in thisCtrl.committers) {
					if (thisCtrl.committers[x].email == data[i].committer.email) {
						committerFound = true;
						continue;
					}
				}
				if (committerFound == false) {
					thisCtrl.committers.push(data[i].committer);
				}
			}
			thisCtrl.refreshValues();
			$scope.initSlider();
			thisCtrl.typesLoad();
		});
  }

  thisCtrl.commitsSearch = function(dateIni, dateEnd) {
  	thisCtrl.filtered.commits = [];
  	thisCtrl.filtered.committers = [];
  	for (i in thisCtrl.commits) {
  		var commitDate = new Date(thisCtrl.commits[i].date.$date);
  		// var committerEvolutionDate = new Date(thisCtrl.committerEvolution[i].date);
  		if (commitDate >= dateIni && commitDate <= dateEnd) {
  			thisCtrl.filtered.commits.push(thisCtrl.commits[i]);
  			var committerFound = false;
				for (x in thisCtrl.filtered.committers) {
					if (thisCtrl.filtered.committers[x].email == thisCtrl.commits[i].committer.email) {
						committerFound = true;
						continue;
					}
				}
				if (committerFound == false) {
					thisCtrl.filtered.committers.push(thisCtrl.commits[i].committer);
				}
  		}
  	}
  }

  	// Load all types from all commits
	thisCtrl.typesLoad = function() {
		var last = null;
		var resumo = [];
		console.log('typesLoad');
		
		$http.get('public/js/types.json')
		.success(function(data) {
			console.log('found', data.length, 'types');
			for (i in thisCtrl.committerEvolution) { 
				// console.log(thisCtrl.committerEvolution[i].commit)
				var last = {
					CC: 0
				}

				for (x in data) {
					if (data[x].commit == thisCtrl.committerEvolution[i].commit) {
						// console.log('data[x]', data[x])
						if (typeof data[x].CC != 'undefined' && data[x].CC.accumulated != 0) {
							// console.log('accumulated', data[x].CC.accumulated, 'last.CC', last.CC, 'cc', (data[x].CC.accumulated - last.CC))
							thisCtrl.committerEvolution[i].type.CC += (data[x].CC.accumulated - last.CC);
							last.CC = data[x].CC.accumulated;
						}
					}
				}
			}
			// console.log(thisCtrl.committerEvolution[2])
		})
		.error(function(dt) {
			console.log('error')
		});
  }

  // Define initial values
  thisCtrl.refreshValues = function () { 
  	console.log('refreshValues');
  	// $sessionStorage.period = '';
	  if (typeof $sessionStorage.period == 'undefined' || $sessionStorage.period == '') {
	  	console.log('-- Initial configuration --')
	  	var dateMin = '';
	  	var dateMax = '';
	  	for (i in thisCtrl.committerEvolution) {
	  		var date = new Date(thisCtrl.committerEvolution[i].date);
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
	  $scope.dateMin = new Date($sessionStorage.period.min);
		$scope.dateMax = new Date($sessionStorage.period.max);
		$scope.dateMinSelected = new Date($sessionStorage.period.minSelected);
		$scope.dateMaxSelected = new Date($sessionStorage.period.maxSelected);
		thisCtrl.commitsSearch($scope.dateMinSelected, $scope.dateMaxSelected);
  }

	thisCtrl.repositoriesLoad();

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };


	$scope.dateMin = new Date();
	$scope.dateMax = new Date();
	$scope.dateMinSelected = new Date();
	$scope.dateMaxSelected = new Date();

	$scope.committers = [];
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

	$scope.getCommittersAll = function() {
		var committers = [];
		for (i in $scope.data.projects) {
			for (x in $scope.data.projects[i].committers) {
				var projectMember = $scope.data.projects[i].committers[x];
				var memberExist = false;
				for (z in committers) {
					if (committers[z].email == projectMember.email) {
						memberExist = true;
					}
				}
				if (memberExist == false){
					committers.push(projectMember);
				}
			}
		}
		return committers;
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
		$scope.getCommitters();
	}

	$scope.getCommitters = function() {
		var committers = [];
		for (i in $scope.commits) {
			var memberExist = false;
			for (x in committers) {
				if (committers[x].email == $scope.commits[i].member) {
					memberExist = true;
				}
			}
			if (memberExist == false) {
				for (z in $scope.committersAll) {
					if ($scope.commits[i].member == $scope.committersAll[z].email) {
						committers.push($scope.committersAll[z]);
						break;
					}
				}
			}
		}
		$scope.committers = committers;
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

	// $http.get('public/js/data.json').success(function(data) {
	// 	$scope.data = data;
	// 	$scope.codeSmellsAll = $scope.getCodeSmellsAll();
	// 	$scope.committersAll = $scope.getCommittersAll();
	// 	$scope.refreshValues();
	// });

});