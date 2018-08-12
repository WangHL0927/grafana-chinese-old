import angular from 'angular';

export class AdminListOrgsCtrl {
  /** @ngInject */
  constructor($scope, backendSrv, navModelSrv) {
    $scope.init = function() {
      $scope.navModel = navModelSrv.getNav('cfg', 'admin', 'global-orgs', 1);
      $scope.getOrgs();
    };

    $scope.getOrgs = function() {
      backendSrv.get('/api/orgs').then(function(orgs) {
        $scope.orgs = orgs;
      });
    };

    $scope.deleteOrg = function(org) {
      $scope.appEvent('confirm-modal', {
        title: '删除',
        text: '你想要删除组织 ' + org.name + '吗？',
        text2: '该组织的所有仪表板都将被删除！',
        icon: 'fa-trash',
        yesText: '删除',
        onConfirm: function() {
          backendSrv.delete('/api/orgs/' + org.id).then(function() {
            $scope.getOrgs();
          });
        },
      });
    };

    $scope.init();
  }
}

angular.module('grafana.controllers').controller('AdminListOrgsCtrl', AdminListOrgsCtrl);
