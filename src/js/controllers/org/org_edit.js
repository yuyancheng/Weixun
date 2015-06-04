'use strict';
app.controller('OrgEdit', ['$scope', '$http', '$state', '$rootScope', '$stateParams',
  function($scope, $http, $state, $rootScope, $stateParams) {
    var dt = $rootScope.details;
    var id = dt.id;

    $scope.viewData = {};
    var superList = $('#superUnit');
    var chooseBtn = $('#chooseBtn');
    var step, firstTime = true;
    
    // 获取要被编辑组织的数据
    $http({
      url: app.url.org.api.edit,
      data: {
        id: id
      },
      method: 'POST'
    }).then(function(dt) {
      dt = dt.data.editData;
      $scope.formData = {
        id: dt.id,
        code: dt.code,
        name: dt.name,
        simpleName: dt.simpleName,
        phoneNumber: dt.phoneNumber,
        fax: dt.fax,
        adminAddress: dt.adminAddress
      };
      if(dt.unitLayerType){
        $scope.formData['unitLayerType.id'] = dt.unitLayerType.id;
        $scope.viewData.unitType = dt.unitLayerType.name;
      }
    });
    // 提交并更新数据
    $scope.submit = function() {
      var url = app.url.org.api.save;
      app.utils.getData(url, $scope.formData, function(dt) {
        $state.reload('app.org');
        //$state.go('app.org.list');
      });
    };
    $scope.choose = function() {
      var url = app.url.orgUnits;
      var data = null;
      step = chooseBtn.data('step') || 0;
      if(step === 0){
        if(firstTime){
          app.utils.getData(url, function callback(dt) {
            data = dt;
            initTable(data);
            superList.removeClass('none');
            chooseBtn.html('取消').data('step', 1);
          });
          firstTime = false;
        }else{
          superList.removeClass('none');
          chooseBtn.html('取消').data('step', 1);
        }
      }else{
        superList.addClass('none');
        chooseBtn.html('选择').data('step', 0);
      }
    };
    // 下拉框 chosen

    var orgTypeChosen = $('#orgType');
    orgTypeChosen.chosen({
      placeholder_text_single: '选择集团/公司/部门',
      disable_search: true
    }).ready(function(evt, params) {
      if(dt.unitLayerType){
        orgTypeChosen.siblings('.chosen-container').find('.chosen-default span').html(dt.unitLayerType.name);
      }
      console.log(params);
    }).on('change', function(evt, params) {
      $scope.formData['unitLayerType.id'] = params.selected;
      console.log(params.selected);
    });

    function initTable(data) {
      var dTable = $('#orgAddList').dataTable({
        "data": data,
        "sAjaxDataProp": "dataList",
        "fnCreatedRow": function(nRow, aData, iDataIndex) {
          $(nRow).attr({'data-id': aData['id'], 'data-name': aData['name']});
        },
        "aoColumns": [{
          "mDataProp": "code"
        }, {
          "mDataProp": "name"
        }]
      });
      dTable.$('tr').dblclick(function(e, settings) {
        //$scope.seeDetails($(this).data('id'));
      }).click(function(e) {
        $scope.formData.parent = $(this).data('id');
        $scope.viewData.superName = $(this).data('name');

        var that = $(this), classname = 'rowSelected';
        var siblings = $(this).siblings();

        var chooseBtn = $('#chooseBtn');
        if(that.hasClass(classname)){
          that.removeClass(classname);
          $('#superName').val('');
          chooseBtn.html('取消').data('step', 1);
        }else{
          that.addClass(classname);
          $('#superName').val($scope.viewData.superName);
          chooseBtn.html('确定').data('step', 2);
        }
        
        siblings.removeClass(classname);
      });
    }
  }
]);