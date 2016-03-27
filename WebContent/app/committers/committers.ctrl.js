homeApp = angular.module('homeApp');

homeApp.controller('committersCtrl', function ($scope, $timeout, $http, $sessionStorage) {

	$scope.refreshValues();
	$scope.initSlider();
	$scope.typesLoad();

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
		$scope.refreshValues();
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

	$scope.commitsSearch = function(dateIni, dateEnd) {
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

  // Define initial values
  $scope.refreshValues = function () { 
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

  // Load all types from all commits
	$scope.typesLoad = function() {
		var last = null;
		var resumo = [];
		console.log('typesLoad');
		
		$http.get('assets/js/types.json')
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
	
});