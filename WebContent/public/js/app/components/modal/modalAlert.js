function ModalAlertController() {

}

angular.module('homeApp').component('modalAlert', {
  templateUrl: 'public/js/app/components/modal/modalAlert.html',
  controller: ModalAlertController,
  bindings: {
    message: '='
  }
});
