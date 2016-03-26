function OverviewController() {

}

angular.module('homeApp').component('treesOverview', {
  templateUrl: 'app/components/trees/overview.html',
  controller: OverviewController,
  bindings: {
    trees: '='
  }
});
