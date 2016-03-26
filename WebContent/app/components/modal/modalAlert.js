function ModalAlertController() {

}

angular.module('homeApp').component('modalAlert', {
  templateUrl: 'app/components/modal/modalAlert.html',
  controller: ModalAlertController,
  bindings: {
    message: '='
  }
});
