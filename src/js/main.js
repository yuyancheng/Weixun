'use strict';
/* Controllers */
angular.module('app').controller('AppCtrl', ['$scope', '$translate', '$localStorage', '$window', '$http', '$state','$cookieStore',
  function($scope, $translate, $localStorage, $window, $http, $state,$cookieStore) {
    // add 'ie' classes to html
    var isIE = !! navigator.userAgent.match(/MSIE/i);
    isIE && angular.element($window.document.body).addClass('ie');
    isSmartDevice($window) && angular.element($window.document.body).addClass('smart');
    app.state = $state;
    // config
    $scope.app = {
      name: '微讯平台',
      version: '1.0.0',
      // for chart colors
      color: {
        primary: '#7266ba',
        info: '#23b7e5',
        success: '#27c24c',
        warning: '#fad733',
        danger: '#f05050',
        light: '#e8eff0',
        dark: '#3a3f51',
        black: '#1c2b36'
      },
      settings: {
        themeID: 1,
        navbarHeaderColor: 'bg-black',
        navbarCollapseColor: 'bg-white-only',
        asideColor: 'bg-black',
        headerFixed: true,
        asideFixed: false,
        asideFolded: false,
        asideDock: false,
        container: false
      }
    }
    // save settings to local storage
    if (angular.isDefined($localStorage.settings)) {
      $scope.app.settings = $localStorage.settings;
    } else {
      $localStorage.settings = $scope.app.settings;
    }
    $scope.$watch('app.settings', function() {
      if ($scope.app.settings.asideDock && $scope.app.settings.asideFixed) {
        // aside dock and fixed must set the header fixed.
        $scope.app.settings.headerFixed = true;
      }
      // save to local storage
      $localStorage.settings = $scope.app.settings;
    }, true);
    // angular translate
    $scope.lang = {
      isopen: false
    };
    $scope.langs = {
      zh_CN: '中文（简体）',
      en: 'English',
      de_DE: 'German',
      it_IT: 'Italian'
    };
    $scope.selectLang = $scope.langs[$translate.proposedLanguage()] || "中文（简体）";
    $scope.setLang = function(langKey, $event) {
      // set the current lang
      $scope.selectLang = $scope.langs[langKey];
      // You can change the language during runtime
      $translate.use(langKey);
      $scope.lang.isopen = !$scope.lang.isopen;
    };

    // 设置默认语言为中文
    $scope.selectLang = $scope.langs['zh_CN'];
    $translate.use('zh_CN');
    $scope.app.ui = {};
    var uiInit = $scope.app.ui.init = function() {
      $http.get('src/api/nav_items').then(function(resp) {
        if (resp.data.datalist) {
          $scope.app.ui.items = resp.data.datalist;
        };
      });
    };
    uiInit();

    // 用户退出
    $scope.logout = function(){
      $http.get(app.url.logout).then(function(response) {
        if (response.statusText === 'OK') {
          $cookieStore.remove('username');
          $state.go('access.signin');
        } else {
          console.log("Logout: " + response.statusText);
        }
      }, function(x) {
        console.log("Logout: " + x.statusText);
      });
    };

    // 公用函数工具
    app.utils = {};
    app.utils.getData = function(u, d, m, h) {
      var args = arguments;
      $http({
        url: u,
        data: typeof d !== 'function' ? d || {} : {},
        method: typeof m !== 'function' ? m || 'POST' : 'POST',
        headers: typeof h !== 'function' ? h || {} : {}
      }).then(function(dt) {
        if ((dt.data.dataList && dt.data.dataList.length !== 0) || dt.data.code == 1) {
          for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === 'function') {
              args[i].call(null, dt.data.dataList);
            };
          }
        } else {
          console.warn(dt.statusText);
        }
      }, function(x) {
        console.error(x.statusText);
      });
    };
    app.utils.getDataByKey = function(data, key, val){
      var len = data.length;
      for(var i=0; i<len; i++){
        if(data[i][key] === val){
          return data[i];
        }
      }
    };

    function isSmartDevice($window) {
      // Adapted from http://www.detectmobilebrowsers.com
      var ua = $window['navigator']['userAgent'] || $window['navigator']['vendor'] || $window['opera'];
      // Checks for iOs, Android, Blackberry, Opera Mini, and Windows mobile devices
      return (/iPhone|iPod|iPad|Silk|Android|BlackBerry|Opera Mini|IEMobile/).test(ua);
    }
  }
]);