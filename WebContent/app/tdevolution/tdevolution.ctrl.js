homeApp = angular.module('homeApp');

homeApp.controller('TDEvolutionCtrl', function($scope, $http, $q, sidebarService){
	var thisCtrl = this;

	$scope.currentPage = sidebarService.getCurrentPage();
	$scope.tags = [];
	$scope.tagsNames = [];

	$scope.sliderTags = [];

	$scope.chartCodeDebtSeries = [];
  $scope.chartDesignDebtSeries = [];
	
	$scope.filtered.repository = sidebarService.getRepository();
	$scope.filtered.tags = sidebarService.getTags();
	$scope.filtered.debts = sidebarService.getDebts();

	thisCtrl.loadEvolutionInformation = function(repository) {
		if (repository) {
			thisCtrl.tagsLoad(repository.uid);
		}	
	}

	// Load all tags (versions)
	thisCtrl.tagsLoad = function(repositoryUid) { 
		console.log('tagsLoad=', repositoryUid);

		 $http.get('TreeServlet', {params:{"action": "getAllTags", "repositoryId": repositoryUid}})
		.success(function(data) {
			console.log('found', data.length, 'tags');
			$scope.tags = data;
			thisCtrl.loadSlider();
		});
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
            		thisCtrl.loadSliderTags();
            },
            translate: function (value) {
                return $scope.tags[value-1].name;
            }
        }
  	};
  	thisCtrl.loadSliderTags();
	}

	thisCtrl.loadSliderTags = function() {
		var listTypesByTags = [];
		var request = thisCtrl.getListOfTypesByListOfTags(listTypesByTags);

		$q.all([request]).then(function() {
			$scope.tagsNames = [];
			$scope.sliderTags = [];
			$scope.chartCodeDebtSeries = [];
			$scope.chartDesignDebtSeries = []; 
			var j = 0;
			
			for (var i = $scope.slider.minValue-1; i < $scope.slider.maxValue; i++) {
					$scope.tagsNames.push($scope.tags[i].name);

					var tag = {
						tag: null,
						types: [],
						totalSmells: 0,
						totalDebts: 0
					};
					tag.tag = $scope.tags[i];
					tag.types = listTypesByTags[j];
					j++;

					var totalCodeDebt = thisCtrl.getTotalOfCodeDebts(tag, tag.types);
					var totalDesignDebt = thisCtrl.getTotalOfDesignDebts(tag, tag.types)
					$scope.chartCodeDebtSeries.push(totalCodeDebt);
					$scope.chartDesignDebtSeries.push(totalDesignDebt);

					tag.totalDebts = totalCodeDebt + totalDesignDebt;
					thisCtrl.getTotalOfCodeSmells(tag, tag.types);
					$scope.sliderTags.push(tag);
			}
			thisCtrl.loadColumnChart();
		});
	}

	thisCtrl.getListOfTypesByListOfTags = function(list) {
		var ids = [];
		for (var i = $scope.slider.minValue-1; i < $scope.slider.maxValue; i++) {
			ids.push($scope.tags[i].uid);
		}
		return $http.get('TypeServlet', {params:{"action": "getListOfTypesByListOfTags", "ids": JSON.stringify(ids)}})
		.success(function(data) {
			for (var j = 0; j < data.length; j++) 
				list.push(data[j]);
		});
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
		var total = thisCtrl.getTotalOfCodeDebts(tag, types);
		total += thisCtrl.getTotalOfDesignDebts(tag, types);
	
		tag.totalDebts = total;
	}

	thisCtrl.getTotalOfCodeDebts = function(tag, types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			for (var j = 0; j < types[i].technicaldebts.length; j++) {
				if (types[i].technicaldebts[j].name == 'Code Debt' && types[i].technicaldebts[j].value) {
					total++;
				}
			}
		}	
		return total;
	}

		thisCtrl.getTotalOfDesignDebts = function(tag, types) {
		var total = 0;
		for (var i = 0; i < types.length; i++) {
			for (var j = 0; j < types[i].technicaldebts.length; j++) {
				if (types[i].technicaldebts[j].name == 'Design Debt' && types[i].technicaldebts[j].value) {
					total++;
				}
			}
		}	
		return total;
	}

	thisCtrl.loadColumnChart = function() {
		$scope.chartConfig = {
      title: {
          text: 'Technical Debt X Versions'
      },
      xAxis: {
          categories: $scope.tagsNames
      },
      yAxis: {
          min: 0,
          allowDecimals: false,
          title: {
              text: 'Total of classes having Technical Debt'
          },
          stackLabels: {
              enabled: true,
              style: {
                  fontWeight: 'bold',
                  color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
              }
          }
      },
      options: {
        chart: {
          type: 'column'
      },
        legend: {
          align: 'right',
          x: -70,
          verticalAlign: 'top',
          y: 20,
          floating: true,
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
      },
      tooltip: {
          formatter: function() {
              return '<b>'+ this.x +'</b><br/>'+
                  this.series.name +': '+ this.y +'<br/>'+
                  'Total: '+ this.point.stackTotal;
          }
      },
      plotOptions: {
          column: {
              stacking: 'normal',
              dataLabels: {
                  enabled: true,
                  color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                  style: {
                      textShadow: '0 0 3px black, 0 0 3px black'
                  }
              }
          }
      }},
      series: [{
      		color: '#1B93A7',
          name: 'Code Debt',
          data: $scope.chartCodeDebtSeries
      },
      {
      		color: '#91A28B',
          name: 'Design Debt',
          data: $scope.chartDesignDebtSeries
      }],
	 		size: {
			   height: 350
			 }
  };
	}

	thisCtrl.loadColumnChart();
	thisCtrl.loadEvolutionInformation($scope.filtered.repository); 

});