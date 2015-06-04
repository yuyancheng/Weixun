'use strict';

angular.module('app').run(
  ['$rootScope', '$state', '$stateParams',
    function($rootScope, $state, $stateParams) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;
    }
  ]).config(
  ['$stateProvider', '$urlRouterProvider', 'JQ_CONFIG',
    function($stateProvider, $urlRouterProvider, JQ_CONFIG) {
      //$urlRouterProvider.when('/app/home');
      $urlRouterProvider.otherwise('/app/home');
      $stateProvider.state('app', {
        abstract: true,
        url: '/app',
        //templateUrl: 'src/tpl/app.html',
        views: {
          '': {
            templateUrl: 'src/tpl/app.html'
          },
          'footer': {
            template: '<div id="dialog-container" ui-view></div>'
          }
        }
      }).state('app.home', {
        url: '/home',
        templateUrl: 'src/tpl/home.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load(['src/js/controllers/home.js']);
            }
          ]
        }
      }).state('app.nav', {
        url: '/nav',
        templateUrl: 'src/tpl/nav_list.html',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load(['src/js/controllers/nav/nav.js']);
            }
          ]
        }
      }).state('app.frame', {
        url: '/frame',
        templateUrl: 'src/tpl/org/frame.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('angularBootstrapNavTree').then(function() {
                //return $ocLazyLoad.load('src/js/controllers/org/frameTest.js');
              })
            }
          ]
        }
      }).state('app.org', {
        url: '/org',
        templateUrl: 'src/tpl/org/org.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('angularBootstrapNavTree').then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/org.js');
              });
            }
          ]
        }
      }).state('app.org.list', {
        url: '/list',
        templateUrl: 'src/tpl/org/org_list.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('src/js/controllers/org/org_list.js').then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable);
              });
            }
          ]
        }
      }).state('app.org.add', {
        url: '/add',
        templateUrl: 'src/tpl/org/org_add.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad, uiLoad) {
              return uiLoad.load(JQ_CONFIG.chosen).then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/org_add.js');
              });
            }
          ]
        }
      }).state('app.org.edit', {
        url: '/edit',
        templateUrl: 'src/tpl/org/org_edit.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad, uiLoad) {
              return uiLoad.load(JQ_CONFIG.chosen).then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/org_edit.js');
              });
            }
          ]
        }
      }).state('app.org.remove', {
        url: '/remove',
        //template: '<div id="dialog-container" ui-view></div>',
        //templateUrl: 'src/tpl/blocks/modal.html',
        //controller: 'AppCtrl',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('src/js/controllers/org/org_remove.js');
            }
          ]
        }
      }).state('app.org.add.list', {
        url: '/list',
        templateUrl: 'src/tpl/org/org_add_list.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad, uiLoad) {
              return uiLoad.load(JQ_CONFIG.dataTable).then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/org_add_list.js');
              });
            }
          ]
        }
      }).state('app.org.position', {
        url: '/position',
        templateUrl: 'src/tpl/org/position/position.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('angularBootstrapNavTree').then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/position/position.js');
              }).then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable).then(function() {
                  //return $ocLazyLoad.load('src/js/controllers/org/org.js');
                });
              });
            }
          ]
        }
      }).state('app.org.employee', {
        url: '/employee',
        templateUrl: 'src/tpl/org/employee/employee.html',
        resolve: {
          deps: ['$ocLazyLoad', 'uiLoad',
            function($ocLazyLoad, uiLoad) {
              return $ocLazyLoad.load('angularBootstrapNavTree').then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/employee/employee.js');
              }).then(function() {
                return uiLoad.load(JQ_CONFIG.dataTable).then(function() {
                });
              });
            }
          ]
        }
      }).state('app.org.details', {
        url: '/details',
        templateUrl: 'src/tpl/org/org_details.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad, uiLoad) {
              return uiLoad.load(JQ_CONFIG.chosen).then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/org_details.js');
              });
            }
          ]
        }
      }).state('app.org.attendance', {
        url: '/attendance',
        templateUrl: 'src/tpl/org/org_attendance.html',
        resolve: {
          deps: ['$ocLazyLoad','uiLoad',
            function($ocLazyLoad, uiLoad) {
              return uiLoad.load(JQ_CONFIG.chosen).then(function() {
                return $ocLazyLoad.load('src/js/controllers/org/org_attendance.js');
              });
            }
          ]
        }
      })
      // form
      .state('app.form', {
        url: '/form',
        template: '<div ui-view class="fade-in"></div>',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load('src/js/controllers/form.js');
            }
          ]
        }
      }).state('app.form.editor', {
        url: '/editor',
        templateUrl: 'src/tpl/form_editor.html',
        controller: 'EditorCtrl',
        resolve: {
          deps: ['$ocLazyLoad',
            function($ocLazyLoad) {
              return $ocLazyLoad.load('textAngular').then(function() {
                return $ocLazyLoad.load('src/js/controllers/editor.js');
              });
            }
          ]
        }
      })
      // pages
      .state('app.page', {
        url: '/page',
        template: '<div ui-view class="fade-in-down"></div>'
      }).state('app.page.profile', {
        url: '/profile',
        templateUrl: 'src/tpl/temp/page_profile.html'
      }).state('app.docs', {
        url: '/docs',
        templateUrl: 'src/tpl/temp/docs.html'
      })
      // others
      .state('lockme', {
        url: '/lockme',
        templateUrl: 'src/tpl/lockme.html'
      }).state('access', {
        url: '/access',
        template: '<div ui-view class="fade-in-right-big smooth"></div>'
      }).state('access.signin', {
        url: '/signin',
        templateUrl: 'src/tpl/signin.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/signin.js']);
            }
          ]
        }
      }).state('access.signup', {
        url: '/signup',
        templateUrl: 'src/tpl/signup.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/controllers/signup.js']);
            }
          ]
        }
      }).state('access.forgotpwd', {
        url: '/forgotpwd',
        templateUrl: 'src/tpl/forgotpwd.html'
      }).state('access.404', {
        url: '/404',
        templateUrl: 'src/tpl/404.html'
      }).state('app.mail', {
        abstract: true,
        url: '/mail',
        templateUrl: 'src/tpl/mail.html',
        resolve: {
          deps: ['uiLoad',
            function(uiLoad) {
              return uiLoad.load(['src/js/app/mail/mail.js', 'src/js/app/mail/mail-service.js',
                JQ_CONFIG.moment
              ]);
            }
          ]
        }
      }).state('app.mail.list', {
        url: '/inbox/{fold}',
        templateUrl: 'src/tpl/mail.list.html'
      }).state('app.mail.detail', {
        url: '/{mailId:[0-9]{1,4}}',
        templateUrl: 'src/tpl/mail.detail.html'
      }).state('layout.mobile', {
        url: '/mobile',
        views: {
          '': {
            templateUrl: 'src/tpl/layout_mobile.html'
          },
          'footer': {
            templateUrl: 'src/tpl/layout_footer_mobile.html'
          }
        }
      }).state('app.todo.list', {
        url: '/{fold}'
      })
    }
  ]);