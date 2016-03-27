var homeApp = angular.module('homeApp');

homeApp.controller('routeController', ['$scope', '$location', function(){
	alert($location.path());
	$scope = showPageTdEvolution = $location.path() === '/tdevolution';	
	$scope = showPageTdAnalyzer = $location.path() === '/tdanalyzer';	
}])