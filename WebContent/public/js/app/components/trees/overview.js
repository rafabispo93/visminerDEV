function OverviewController() {

}

angular.module('homeApp').component('treesOverview', {
  templateUrl: 'public/js/app/components/trees/overview.html',
  controller: OverviewController,
  bindings: {
    trees: '='
  }
});
