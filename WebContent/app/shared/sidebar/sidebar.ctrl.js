// homeApp = angular.module('homeApp');

// homeApp.controller('SidebarCtrl', function ($scope, sharedProperties) {
// 	sidebarCtrl = this;
// 	$scope.page = sharedProperties.getPage();

// 	sidebarCtrl.selectPage = function(page) {
// 		$scope.page = page;
// 		sharedProperties.setPage(page);
// 	}

// 	sidebarCtrl.analyzeDebts = function() {
// 		var analyze = true;
// 		if (sharedProperties.getPage() == "tdevolution") {
// 			alert("tdevolution");
// 		}

// 		if (sharedProperties.getPage() == "committers") {
// 			alert("commiters");
// 		}
// 		$scope.page =  "tdanalyzer";
// 		sharedProperties.setPage("tdanalyzer");
// 		alert(sharedProperties.getPage());
// 	}

// 	// sidebarCtrl.analyzeDebts = function() {
// 	// 	var analyze = true;
// 	// 	if (thisCtrl.filtered.repository == null) {
// 	// 	  thisCtrl.alertMessage = "Please Select a Repository!";
// 	// 	  analyze = false;
// 	// 	} 
// 	// 	else if (thisCtrl.filtered.tags.length == 0) {
// 	// 	  thisCtrl.alertMessage = "Please Select What Versions Will be Analyzed!";
//  //          analyze = false;
// 	// 	} 
// 	// 	else if (thisCtrl.filtered.debts.length == 0) {
// 	// 	  thisCtrl.alertMessage = "Please Select What Technical Debts Will be Analyzed!";
// 	// 	  analyze = false;
// 	// 	}

// 	// 	if (analyze) {
// 	// 		sharedProperties.setPage("tdanalyzer");
// 	// 	} else {
// 	// 		$('#alertModal').modal('show');
// 	// 	}
// 	// }
	
// });