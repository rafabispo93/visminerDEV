function OverviewController() {

}

angular.module('homeApp').component('commitersOverview', {
  templateUrl: 'app/components/commiters/overview.html',
  controller: OverviewController,
  bindings: {
    commiter: '='
  }
});
