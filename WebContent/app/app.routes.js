homeApp.config(['$routeProvider', '$locationProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'app/tdevolution/tdevolution.html',
        controller: 'TDEvolutionCtrl'
      }).
			when('/tdevolution', {
		    templateUrl: 'app/tdevolution/tdevolution.html',
		    controller: 'TDEvolutionCtrl'
		      }).
			when('/tdanalyzer', {
		    templateUrl: 'app/tdanalyzer/tdanalyzer.html',
		    controller: 'TDAnalyzerCtrl'
		      }).
			when('/tdmanagement', {
		    templateUrl: 'app/tdmanagement/tdmanagement.html',
		    controller: 'TDManagementCtrl'
		      }).
			when('/tdcommitters', {
		    templateUrl: 'app/tdcommitters/tdcommitters.html',
		    controller: 'TDCommittersCtrl'
		      }).
			otherwise({ redirectTo: '/tdevolution' });
			$locationProvider.html5Mode(true);
 }]);