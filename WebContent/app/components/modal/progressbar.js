angular.module('homeApp').component('progressbar', {
  controller: function($location) {
  	 var progressBarModal = "#progressBarModal";
  	 $(progressBarModal).on('show.bs.modal', function(e) {
  	    loadBar();
  	 });
   },
  bindings: {
    durationProgress: '='
  },
  templateUrl: 'app/components/modal/progressbar.html',
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
        $bar.width($bar.width()+120);
    }
    if($bar.width()/6>=100){
        $bar.width(0);
        $('.progress').removeClass('active');
        $bar.text("100 %");
    }else
        $bar.text(($bar.width()/6).toPrecision(2) + "%");
  }, 1080);

  }
