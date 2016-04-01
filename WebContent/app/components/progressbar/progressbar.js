angular.module('homeApp').component('progressbar', {
  controller: function($scope) {
  	 var progressBarModal = "#progressBarModal";
     var modalVerticalCenterClass = ".modal";
     $scope.$on('setProgressbarDuration', function(event, duration){
        $scope.duration = duration;
      });   
  	 $(progressBarModal).on('show.bs.modal', function(e) {
        centerModals($(this));
  	    loadBar();
  	 });
     $(window).on('resize', centerModals);
   },
  templateUrl: 'app/components/progressbar/progressbar.html',
});

function loadBar(){
    var $bar = $('.progress-bar');
    $bar.width(0);
    var progress = setInterval(function() {
    if ($bar.width()>=600) {
        $bar.width(0);
        $('.progress').removeClass('active');
        $(progressBarModal).modal("hide");
    } else {
        $bar.width($bar.width()+60);
    }
    if($bar.width()/6>=100){
        $bar.width(0);
        $('.progress').removeClass('active');
        $bar.text("100 %");
    }else {
        $bar.text((($bar.width()/6)+10).toPrecision(2) + "%");
    }
  }, 600);

  }
