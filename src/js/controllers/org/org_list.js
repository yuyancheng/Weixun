'use strict';

app.controller('OrgList', function($rootScope, $scope, $state, $stateParams) {
  //var url = app.url.org.api.list;
  var url = app.url.org.subUnits;
  var data = null;
  var params = {
    "pager.currentPage": 1,
    "pager.pageSize": 100,
    "items[0].value": '00000000-0000-0000-0000-000000000000CCE7AED4',
    "items[0].name": 'id',
    "items[0].type": 'String',
    "items[0].compareType": 'eq'
  };
  var id_key = {
    "id": '00000000-0000-0000-0000-000000000000CCE7AED4'
  };
  app.utils.getData(url, id_key, function callback(dt){
    data = dt;
    initTable();
  });

  function formatData(data) {
    var keys = ['parent', 'creator', 'onDutyTime', 'onOffTime', 'createTime', 'lastModifyTime'];
    var len = keys.length, l = data.length;
    for (var i = 0; i < len; i++) {
      switch (i) {
        case 0:
          var dt = [];
          for (var n = 0; n < l; n++) {
            if (data[n][keys[i]]) dt.push(data[n][keys[i]]);
          }
          app.utils.getData(url, dt, function(d){});
        default:
          break;
      }
    }
    return data;
  }

  //var ids = [], obj;
  $rootScope.ids = [], $rootScope.obj;

  function clicked(target, that){
    var classname = 'rowSelected', id;

    target.click(function(e){
      var evt = e || window.event;
      //evt.preventDefault();
      evt.stopPropagation();

      if(!that){
        that = $(this).parents('tr');
      }

      $rootScope.details = $rootScope.obj = app.utils.getDataByKey(data, 'id', that.data('id'));
      id = $rootScope.obj['id'];

      if(!$(this)[0].checked){
        var idx = $rootScope.ids.indexOf(id);
        if(idx !== -1 ) $rootScope.ids.splice(idx, 1);
        that.removeClass(classname);
        //orgList.find('thead .i-checks input')[0].checked = false;
      }else{
        $rootScope.ids.push(id);
        that.addClass(classname);
      }
      $scope.setBtnStatus();
    });
  }

  // 初始化表格 jQuery datatable
  var orgList = $('#orgList');
  function initTable() {
    var dTable = orgList.dataTable({
      // "serverSide": true,
      // "ajax": {
      //   "url": app.url.org.subUnits,
      //   "type": 'POST',
      //   "data": {
      //     "id": '00000000-0000-0000-0000-000000000000CCE7AED4'
      //   }
      // },
      // "bFilter": true,
      "data": data,
      "sAjaxDataProp": "dataList",
      "oLanguage": {
        "sLengthMenu": "每页 _MENU_ 条",
        "sZeroRecords": "没有找到符合条件的数据",
        "sProcessing": "&lt;img src=’./loading.gif’ /&gt;",
        "sInfo": "当前第 _START_ - _END_ 条，共 _TOTAL_ 条",
        "sInfoEmpty": "没有记录",
        "sInfoFiltered": "(从 _MAX_ 条记录中过滤)",
        "sSearch": "搜索",
        "oPaginate": {
          "sFirst": "<<",
          "sPrevious": "<",
          "sNext": ">",
          "sLast": ">>"
        }
      },
      "fnCreatedRow": function(nRow, aData, iDataIndex){
        $(nRow).attr('data-id', aData['id']);
      },
      "drawCallback": function( settings ) {
        var input = orgList.find('thead .i-checks input');
        var inputs = orgList.find('tbody .i-checks input');
        var len = inputs.length, allChecked = true;
        for(var i=0; i<len; i++){
          if(!inputs.eq(i)[0].checked){
            allChecked = false;
            break;
          }
        }
        if(allChecked){
          input[0].checked = true;
        }else{
          input[0].checked = false;
        }
        
        input.off().click(function(){
          for(var i=0; i<len; i++){
            if(!inputs.eq(i)[0].checked || !$(this)[0].checked){  
              clicked(inputs.eq(i).off());
              inputs.eq(i).trigger('click');
            }
          }
        });
      },
      "aoColumns": [{
        "orderable": false,
        "render": function(param){
          return '<label class="i-checks"><input type="checkbox"><i></i></label>';
        }
      }, {
        "mDataProp": "code",
      }, {
        "mDataProp": "name"
      }, {
        "mDataProp": "longName"
      }, {
        "mDataProp": "simpleName"
      }, {
        "mDataProp": "parent"
      }, {
        "mDataProp": "fax"
      }, {
        "mDataProp": "phoneNumber"
      }, {
        "mDataProp": "onDutyTime"
      }, {
        "mDataProp": "location"
      }, {
        "mDataProp": "zipCode"
      }, {
        "mDataProp": "createTime",
        "render": function(o) {
          return DataRender.DateTime(o);
        }
      }, {
        "mDataProp": "creator"
      }, {
        "mDataProp": "lastModifyTime",
        "render": function(o) {
          return DataRender.DateTime(o);
        }
      }]
    });

    var id;
    
    // 表格行事件
    dTable.$('tr').dblclick(function(e, settings) {
      $scope.seeDetails($(this).data('id'));
    }).click(function(e) {
      var evt = e || window.event;
      var target = event.target || event.srcElement;

      evt.preventDefault();
      //evt.stopPropagation();
      var ipt = $(this).find('.i-checks input');
      clicked(ipt.off(), $(this));
      ipt.trigger('click');
      var input = orgList.find('thead .i-checks input');
      var inputs = orgList.find('tbody .i-checks input');
      var len = inputs.length, allChecked = true;
      for(var i=0; i<len; i++){
        if(!inputs.eq(i)[0].checked){
          allChecked = false;
          break;
        }
      }
      if(allChecked){
        input[0].checked = true;
      }else{
        input[0].checked = false;
      }
    });
  }

});