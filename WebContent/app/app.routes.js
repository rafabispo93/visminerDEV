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
			when('/committers', {
		    templateUrl: 'app/committers/committers.html',
		    controller: 'CommittersCtrl'
		      }).
			otherwise({ redirectTo: '/tdevolution' });
			$locationProvider.html5Mode(true);
 }]);