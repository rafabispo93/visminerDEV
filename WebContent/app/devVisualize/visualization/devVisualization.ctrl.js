homeApp = angular.module('homeApp');

homeApp.controller('devVisualizationCtrl', function($scope, $http, $q, sidebarService){
	var thisCtrl = this;
	$scope.currentPage = sidebarService.getCurrentPage();
	
	var Log = {
		    elem: false,
		    write: function(text){
		        if (!this.elem) 
		            this.elem = document.getElementById('log');
		        this.elem.innerHTML = text;
		        this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
		    }
		};
	
	thisCtrl.makeJsonData = function(){
		
	}

	thisCtrl.addEvent = function(obj, type, fn) {
	    if (obj.addEventListener) obj.addEventListener(type, fn, false);
	    else obj.attachEvent('on' + type, fn);
	};
});