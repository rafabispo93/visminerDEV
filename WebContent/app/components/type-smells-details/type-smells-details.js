angular.module('homeApp').component('typeSmells', {
  controller: function ($scope) {
			$scope.hasCodeSmell = function(type, codeSmell) {
				if (type) {
					var codeSmellList = type.abstract_types[0].codesmells;
					for (var i = 0; i < codeSmellList.length; i++) {
						if (codeSmellList[i].name == codeSmell && codeSmellList[i].value) {
							$scope.metrics = type.abstract_types[0].metrics;
							return true;
						}
					}
				}
			}

  		var modalVerticalCenterClass = ".modal";
			$(".modal").on('show.bs.modal', function(e) {
			  centerModals($(this));
			});
			$(window).on('resize', centerModals);
			
			$scope.$on('showTypeSmellsDetails', function(event, type){
	  		$scope.type = type;
	  	}); 
  },
  templateUrl: 'app/components/type-smells-details/type-smells-details.html',
});
