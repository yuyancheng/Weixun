'use strict';

// 首页控制器
app.controller('HomeController', ['$state', '$cookieStore',
  function($state, $cookieStore) {
    //$scope.user = {};
    //var days = 1;
    //var exp = new Date();
    //exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    //console.log(response.headers('Set-Cookie'));
    //document.cookie = 'JSESSIONID=' + escape('1CAEA6F42C32BDC35784264D187EBB92') + ';expires = ' + exp.toGMTString();
    var cookie = $cookieStore.get('username');
    console.log(cookie);
    if(!cookie){
      $state.go('access.signin');
    }
    //$cookies.username = escape($scope.user.name) + ';expires = ' + exp.toGMTString();;
    //$state.go('app.home');
  }
]);