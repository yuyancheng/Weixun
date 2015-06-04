// config
var app = angular.module('app').config(
  ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$stateProvider',
    function($controllerProvider, $compileProvider, $filterProvider, $provide, $stateProvider) {
      // lazy controller, directive and service
      app.controller = $controllerProvider.register;
      app.directive = $compileProvider.directive;
      app.filter = $filterProvider.register;
      app.factory = $provide.factory;
      app.service = $provide.service;
      app.constant = $provide.constant;
      app.value = $provide.value;
      // API路径集合
      app.urlRoot = '/weixun/';
      //app.urlRoot = 'http://localhost:8070/weixun/{_proxy}/';
      var common = {
        list: 'list.iv',
        save: 'save.iv',
        edit: 'edit.iv',
        modify: 'modify.iv',
        delete: 'delete.iv',
        find: 'findByIds.iv',
        view: 'view.iv'
      };

      function getApi(name, common) {
        var apis = {};
        for (var n in common) {
          apis[n] = app.urlRoot + name + '/' + common[n];
        }
        return apis;
      }
      app.url = {
        login: app.urlRoot + 'user/login.iv',
        logout: app.urlRoot + 'user/logout.iv',
        currentUser: app.urlRoot + 'user/currentUserInfo.iv',
        menus: app.urlRoot + 'mainMenuItem/list.iv',
        orgUnits: app.urlRoot + 'adminOrgUnit/allAdminOrgUnits.iv',
        orgTypes: app.urlRoot + 'orgUnitLayerType/allAdminOrgUnits.iv',
        org: {
          api: getApi('adminOrgUnit', common),
          freeze: app.urlRoot + 'adminOrgUnit/freeze.iv',
          allUnits: app.urlRoot + 'adminOrgUnit/allAdminOrgUnits.iv',
          subUnits: app.urlRoot + 'adminOrgUnit/directSubAdminOrgUnits.iv'
        },        
        orgLayer: {
          api: getApi('orgUnitLayer', common)
        },        
        employee: {
          api: getApi('person', common)
        },        
        position: {
          api: getApi('position', common)
        },
        //orgLayer: app.urlRoot + 'orgUnitLayer/list.iv',
        orgSave: app.urlRoot + 'adminOrgUnit/save.iv',
        orgEdit: app.urlRoot + 'adminOrgUnit/modify.iv',
        position: app.urlRoot + 'position/list.iv',
        employee: app.urlRoot + 'person/list.iv',
        signup: app.urlRoot + 'person/save.iv',
        system: app.urlRoot + 'param/list.iv'
      };
    }
  ]).config(['$translateProvider',
  function($translateProvider) {
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'src/l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }
]).factory('authorityInterceptor', [

  function() {
    var authorityInterceptor = {
      response: function(response) {
        //console.log(response);
        if ('no permission' == response.data) {
          //console.log(response);
          app.controller('Interceptor', ['$state',
            function($state) {
              app.state.go('access.404');
            }
          ]);
        }
        if ("no login" == response.data) {
          //console.log(response);
          app.state.go('access.signin');
        }
        return response;
      }
    };
    return authorityInterceptor;
  }
]).config(
  ['$httpProvider',
    function($httpProvider) {
      $httpProvider.interceptors.push('authorityInterceptor');
      $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
      $httpProvider.defaults.transformRequest = [

        function(data) {
          return angular.isObject(data) && String(data) !== '[object File]' ? $.param(data) : data;
        }
      ];
    }
  ]);