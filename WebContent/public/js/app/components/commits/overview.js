function OverviewController() {

}

angular.module('homeApp').component('commitsOverview', {
  templateUrl: 'public/js/app/components/commits/overview.html',
  controller: OverviewController,
  bindings: {
    commits: '='
  }
});
