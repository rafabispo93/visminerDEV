angular.module('homeApp').component('alertModal', {
  controller: function ($scope, alertModalService) {
  	$scope.$on('updateModalMessage', function(event, message){
  		$scope.alertMessage = message;
  	}); 	
  },
  templateUrl: 'app/components/modal/alertModal.html',
});
