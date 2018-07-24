import angular from 'angular';
import _ from 'lodash';

export class SnapshotsCtrl {
  navModel: any;
  snapshots: any;

  /** @ngInject */
  constructor(private $rootScope, private backendSrv, navModelSrv) {
    this.navModel = navModelSrv.getNav('dashboards', 'snapshots', 0);
    this.backendSrv.get('/api/dashboard/snapshots').then(result => {
      this.snapshots = result;
    });
  }

  removeSnapshotConfirmed(snapshot) {
    _.remove(this.snapshots, { key: snapshot.key });
    this.backendSrv.delete('/api/snapshots/' + snapshot.key).then(
      () => {},
      () => {
        this.snapshots.push(snapshot);
      }
    );
  }

  removeSnapshot(snapshot) {
    this.$rootScope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确定要删除快照' + snapshot.name + '吗？',
      yesText: '删除',
      icon: 'fa-trash',
      onConfirm: () => {
        this.removeSnapshotConfirmed(snapshot);
      },
    });
  }
}

angular.module('grafana.controllers').controller('SnapshotsCtrl', SnapshotsCtrl);
