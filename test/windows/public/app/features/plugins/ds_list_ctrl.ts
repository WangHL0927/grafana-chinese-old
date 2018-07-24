import coreModule from '../../core/core_module';
import _ from 'lodash';

export class DataSourcesCtrl {
  datasources: any;
  unfiltered: any;
  navModel: any;
  searchQuery: string;

  /** @ngInject */
  constructor(private $scope, private backendSrv, private datasourceSrv, private navModelSrv) {
    this.navModel = this.navModelSrv.getNav('cfg', 'datasources', 0);
    backendSrv.get('/api/datasources').then(result => {
      this.datasources = result;
      this.unfiltered = result;
    });
  }

  onQueryUpdated() {
    let regex = new RegExp(this.searchQuery, 'ig');
    this.datasources = _.filter(this.unfiltered, item => {
      return regex.test(item.name) || regex.test(item.type);
    });
  }

  removeDataSourceConfirmed(ds) {
    this.backendSrv
      .delete('/api/datasources/' + ds.id)
      .then(
        () => {
          this.$scope.appEvent('alert-success', ['数据源已删除', '']);
        },
        () => {
          this.$scope.appEvent('alert-error', ['无法删除数据源', '']);
        }
      )
      .then(() => {
        this.backendSrv.get('/api/datasources').then(result => {
          this.datasources = result;
        });
        this.backendSrv.get('/api/frontend/settings').then(settings => {
          this.datasourceSrv.init(settings.datasources);
        });
      });
  }

  removeDataSource(ds) {
    this.$scope.appEvent('confirm-modal', {
      title: '删除',
      text: '您确定要删除数据源吗？ ' + ds.name + '?',
      yesText: '删除',
      icon: 'fa-trash',
      onConfirm: () => {
        this.removeDataSourceConfirmed(ds);
      },
    });
  }
}

coreModule.controller('DataSourcesCtrl', DataSourcesCtrl);
