'use strict';

app.controller('PositionController', function($scope, $http, $rootScope) {
  var data = {};
  var url = app.url.position;
  // 从后台获取数据
  app.utils.getData(url, function callback(dt){
    data = dt;
    initTable();
  });
  
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
  var positionList = $('#positionList');
  function initTable() {
    var dTable = positionList.dataTable({
      // serverSide: true,
      // ajax: {
      //   url: app.url.employee,
      //   type: 'POST',
      //   success: function(dt){
      //     data = dt.dataList;
      //   }
      // },
      // bFilter: true,
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
        var input = positionList.find('thead .i-checks input');
        var inputs = positionList.find('tbody .i-checks input');
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
        "mDataProp": "jobID"
      }, {
        "mDataProp": "name"
      }, {
        "mDataProp": "state"
      }, {
        "mDataProp": "adminOrgUnit"
      }, {
        "mDataProp": "description"
      }, {
        "mDataProp": "effectDate",
        "render": function(o) {
          return DataRender.DateTime(o);
        }
      }, {
        "mDataProp": "valiDate",
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
      var input = positionList.find('thead .i-checks input');
      var inputs = positionList.find('tbody .i-checks input');
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

  //initTable();
});