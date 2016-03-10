function OverviewController() {

}

angular.module('homeApp').component('commitersOverview', {
  templateUrl: 'public/js/app/components/commiters/overview.html',
  controller: OverviewController,
  bindings: {
    commiter: '='
  }
});
