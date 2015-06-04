'use strict';

app.controller('OrgController', function($rootScope, $scope, $state, $timeout) {
  var url = app.url.orgUnits; // 后台API路径
  var data = null;

  // 从后台获取数据
  app.utils.getData(url, function callback(dt){
    data = dt;
    initData();
    //initTable();
    //$state.go('app.org.list');
  });

  var nodes = {};
  var treeData = [];

  // 构造节点
  function setNode(dt) {
    if (!nodes['id' + dt['id']]) {
      var node = {};
    } else {
      return nodes['id' + dt['id']];
    }
    node['label'] = dt.name || '没有名字';
    node['data'] = '没有数据';
    node['children'] = node['children'] || [];
    node['onSelect'] = item_selected;
    if (dt['parent']) {
      setParentNode(node, dt['parent']);  // 若存在父节点，则先构造父节点
    } else {
      node['parent'] = null;
    }
    nodes['id' + dt['id']] = node;
    return node;
  }

  // 构造父节点
  function setParentNode(node, id) {
    var len = data.length;
    for (var i = 0; i < len; i++) {
      if (data[i]['id'] === id) {
        var parentNode = setNode(data[i]);
        parentNode['children'].push(node);
      }
    }
  }

  // 列表树数据
  $scope.tree_data = [];
  $scope.org_tree = {};

  // 初始化数据并生成列表树所需的数据结构
  function initData() {
    //data = formatData(data);
    var len = data.length;
    for (var i = 0; i < len; i++) {
      var node = setNode(data[i]);
      if (node['parent'] === null) {
        treeData.push(node);
      }
    }
    var container_a = [], container_b = [], ln = treeData.length;
    for(var i=0; i<ln; i++){
      if(treeData[i].children.length !== 0){
        treeData[i].expanded = true;
        container_a.push(treeData[i]);
      } else{
        container_b.push(treeData[i]);
      }
    }
    treeData = container_a.concat(container_b);
    console.log(treeData);

    // 列表树数据传值
    $scope.tree_data = treeData;

    $timeout(function(){
      // 默认选中第一个节点
      $scope.org_tree.select_first_branch();
    }, 200);
  }

  // 选择列表树中的一项
  var item_selected = function(branch) {
/*    app.utils.getData(url, function callback(dt){
      data = dt;
      $state.go('app.org.list');
    });*/
    //$scope.org_tree.select_first_branch();
    console.log(branch);
    //$state.go('app.org.list');
  };  

  // 选择列表树中的一项
  var tree_handler = function(branch) {
    //console.log(branch);
  };

  $scope.click = function(){
    //console.log("click: " + $scope.single);
  };

  // 添加组织（工具栏按钮）
  $scope.addUnit = function(){
    if($rootScope.ids.length === 0){
      $rootScope.details = {};
    }
    $state.go('app.org.add');
  };

  // 编辑某一组织（工具栏按钮）
  $scope.editIt = function(){
    if($rootScope.obj['id']){
      $rootScope.details = $rootScope.obj;
      $state.go('app.org.edit');
    }
  };   

  var mask = $('<div class="mask"></div>');
  var container = $('#dialog-container');
  var dialog = $('#dialog');
  var hButton = $('#clickId');
  var doIt = function(){};

  // 冻结某一组织（工具栏按钮）
  $scope.freeze = function(){
    mask.insertBefore(container);
    container.removeClass('none');
    doIt = function(){
      app.utils.getData(app.url.org.freeze, {id: $rootScope.ids[0]['id']}, function callback(dt){
        //data = dt;
      });
    };
  };

  // 设置某一组织的考勤时间（工具栏按钮）
  $scope.attendance = function(){
    $state.go('app.org.attendance');
  };

  // 删除某一组织（工具栏按钮）
  $scope.removeIt = function(){
    mask.insertBefore(container);
    container.removeClass('none');
    doIt = function(){
      if($rootScope.ids.length !== 0){
        var url = app.url.org.api.delete;
        app.utils.getData(url, {id:$rootScope.ids[0]}, function callback(dt){
          mask.remove();
          container.addClass('none');
          $state.reload('app.org.list');
        });
      }
    };
  };

  // 执行操作
  $rootScope.do = function(){
    doIt();
  };

  // 模态框退出
  $rootScope.cancel = function(){
    mask.remove();
    container.addClass('none');
  };  

  // 不操作返回
  $scope.return = function(){
    $rootScope.ids = [];
    //$scope.setBtnStatus();
    window.history.back();
  };  

  // 查看某一组织详情（工具栏按钮）
  $scope.seeDetails = function(id){
    $rootScope.details = app.utils.getDataByKey(data, 'id', id ? id : $rootScope.ids[0]);
    $state.go('app.org.details');
  };

  // 设置按钮的状态值
  $scope.setBtnStatus = function(params){
    if($rootScope.ids.length === 0){
      $scope.only = true;
      $scope.single = true;
      $scope.locked = true;
      $scope.mutiple = true;
      $scope.only = false;
    }else if($rootScope.ids.length === 1){
      $scope.only = false;
      $scope.single = false;
      $scope.locked = false;
      $scope.mutiple = false;
    }else{
      $scope.only = true;
      $scope.single = true;
      $scope.locked = true;
      $scope.mutiple = false;
    }

    if(!$rootScope.obj.locked){
      if(!$scope.single) {
        $('button .fa-lock').next('span').html('冻结');
      }
    } else {
      if(!$scope.single){
        $('button .fa-lock').next('span').html('解冻');
      }
    }

    hButton.trigger('click'); // 触发一次点击事件，使所以按钮的状态值生效
  };

});