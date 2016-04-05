angular.module('homeApp').component('typeSmells', {
  controller: function ($scope) {
			$scope.hasAntiPattern = function(type, antipattern) {
				if (type) {
					var antiPatternList = type.antipatterns;
					for (var i = 0; i < antiPatternList.length; i++) {
						if (antiPatternList[i].name == antipattern && antiPatternList[i].value) {
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
