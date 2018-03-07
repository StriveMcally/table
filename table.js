/**
 * 创建table的插件
 * 
 */

;(function($,window){
	var Table=function(domStr,options){
    // --------------------------------------------------------------------
    //                       default option
    // --------------------------------------------------------------------
    this. defaultOption = {
        noNumColumn: false, // 指定不添加序号列
        editable: true, // 指定是否可以编辑
        uniqueId: null, // 数据唯一标识字段名
        undefinedText: "-",
        paginationBar: null, // mf.PaginationBar对象
        searchBarStr: null, // 搜索栏查找串
        dblclick_editable: true,  //是否可以双击行编辑
        enter_addble: true, //是否可以回车新增
        fn_getData: null, // * fn_getData(pagination, searchData,goForwordSafely success) 获取数据 pagination 分页数据 searchData 搜索数据 success(data) 成功回调 data:{rows:数据数组, total:数组行数}
        fn_saveData: null, // * fn_saveData(data, success, fail) 保存数据 data 要保存的数据 {inserted:[],updated:[],deleted:[]} success(data) 成功回调
        fn_onRowClick: null, // fn_onRowClick(data) 行点击事件 data 行数据
        fn_onRowDBlClick: null, // fn_onRowDBlClick() 行双击事件
        fn_onTableEnterPress: null, //fn_onTableEnterPress() 列表回车事件
        fn_onEditingRowRandFinish: null, // fn_onEditingRowRandFinish($row) 编辑行创建完毕事件 $row 编辑行jquery对象
        fn_onEditingRowArgsCheck: null, // fn_onEditingRowArgsCheck($row) 编辑行输入合法性检查事件，当各列设置的Checker通过后才触法此事件 $row 编辑行jquery对象
        fn_checkeditable: null,
        columns: [], // field title rander defaultValue focusField class align 
        //width visible require searchable searchClass searchTitle
        focusEditField: null,//进入编辑状态光标定位到某栏位
        focusField: null,//新增时光标定位到某栏位
        //operateColumTitle: lang.operateColumTitle,
        operateColumWidth: "200px",
        fn_createBtn: null, // fn_createBtn(rowData) 创建操作按钮,返回操作按钮jquery对象 rowData当前行的所有数据  
        enableMultiSelectColumn: false,
        multiSelectColumnIndex: 0, // 多选列位置，从0开始，只有enableMultiSelectColumn为true时才有效
        multiSelectColumnTitle: "", // 多选列表头，只有enableMultiSelectColumn为true时才有效     
        sumColumn: null, // [ {columnName:"col1", columnTitle:"合计", columnStyle:"", columnClass: ""} ]
        rowDraggable: false, // 设置行是否可以拖动
        rowDroppable: false, // 设置行是否可以被放入
        rowDroppableAccept: null,
        fn_rowDrop: null, // 行被放入回调 fn_rowDrop(event, obj)
        isFrozenColumn: false, //是否冻结列，默认值为false
        allowRowClick: false, //允许行点击事件可以一直触发，否则只触发一次
        isRealDelete: false, //是否单个实时删除
        fn_realDelete: null, //实时删除的回调函数fn_realDelete(rowData, success)
        fn_ResetRow: null, //创建编辑行状态后，重置编辑器，主要针对部分Rander
        LastWidth: null, //设置最后一列宽度
        IsSetTableWidth: false, //自动计算宽度是否开启
        fn_paginationBarisload: null, //判断点击分页后是否重新加载表格
        fn_paginationBarClick: null, //如果分页点击了的触发事件
        columnDraggable: false, //是否可移动列
        multiSelectAddClickEvent: false,//允许给列表每一行的多选框添加点击事件
        multiSelectAddClickEventName: null,//给多选框添加事件的名称multiSelectAddClickEventName:"model.checkboxClick(this)",然后在全局作用域定义该事件
        isCustomize: false,//是否可自定义
        fn_Customize: null, //可自定义回调函数fn_Customize(success)
        IsSetheight: null, //是否需要设置高度
        IsSort:false,
    };
    // --------------------------------------------------------------------
    //                       default defaultColumn
    // --------------------------------------------------------------------
    this.defaultColumn = {
        visible: true,
        require: false,
        searchable: false,
        Isborder: false, //Isborder是否移除边框。默认false不移除 
        Iscustomize: false, //是否可自定义
    };
     if(this.getConfig(domStr,options)){
	   	this.init();	   	
	 };
		//console.log(JSON.stringify(this.settings));
	}
Table.prototype={
   getConfig:function(domStr,options){  	  	
   	  	  if (!domStr || domStr.length <= 0) {
		        console.error("table domStr is null");
		        return false;
           }
		    this.$table = $(domStr);
		    var $table=this.$table;
		    if ($table.length <= 0) {
		        console.error("invaild table domStr:" + domStr);
		        return false;
		    }
		    if (!options) {
		        option = {};
		    }
           this.settings = $.extend({}, this. defaultOption, options);
           var option=this.settings;
           var uniqueId = option.uniqueId;
		    if (!uniqueId || uniqueId.length <= 0) {
		        console.error("you have not configure options.uniqueId.");
		        return false;
		    }		
		     var columns = option.columns;
		    var length = columns.length;
		    if (!columns || length <= 0) {
		        console.error("you have not configure any columns.");
		        return false;
		    }		
		    for (var i = 0; i < length; i++) {
		        var column = columns[i];
//		        var rander = column.rander;
//		        if (rander && !(rander instanceof mf.Rander)) {
//		            console.error("you have configure a invaild Rander of field:" + column.field);
//		            return null;
//		        }
		
//		        var checkers = column.checkers;
//		        if (checkers && checkers.length > 0) {
//		            for (var j = 0, length2 = checkers.length; j < length2; j++) {
//		                if (!(checkers[j] instanceof mf.Checker)) {
//		                    console.error("you have configure a invail EditCheck in field:" + column.field);
//		                    return null;
//		                }
//		            }
//		        }
		
		        columns[i] = $.extend({}, this.defaultColumn, column);
		        this.columns=columns;
		    }

//          var paginationBar = option.paginationBar;
//		    if (paginationBar && !(paginationBar instanceof mf.PaginationBar)) {
//		        console.error("you have configure a wrong type paginationBar, it must be a mf.PaginationBar.");
//		        return null;
//		    }
//		    if (paginationBar) {
//		        paginationBar.change(onPaginationBarChange);
//		    }
		
		    var fn_getData = option.fn_getData;
		    if (!fn_getData) {
		        console.error("you have not configure fn_getData.");
		        return false;
		    }
		    if (typeof fn_getData != "function") {
		        console.error("the fn_getData you configured is not a function.");
		        return false;
		    }
		
		    if (option.editable) {
		        var fn_saveData = option.fn_saveData;
		        if (!fn_saveData) {
		            console.error("you have not configure fn_saveData.");
		            return false;
		        }
		        if (typeof fn_saveData != "function") {
		            console.error("the fn_saveData you configured is not a function.");
		            return false;
		        }
		    }
        
        
        
        return true;
   	 },
   init:function(){
   	 	  // 构建table
		  var  
		    option=this.settings,
		         $wrapper = $('<div class="mf-table-wrapper"></div>'),
		         $table=this.$table,
		         $parent = $table.parent(),
		         $thead = this.createThHeader(this.columns),
		         $headTable = $("<table>"),
		         $tbody = $("<tbody>"),
		         $fixHeadDiv = $('<div>'),
		         $fixTableDiv = $("<div>");
		    $parent.append($wrapper);    
		    $headTable
		        .addClass("table table-bordered mf-head-table")
		        .append($thead);
		    $fixHeadDiv
		        .addClass("fix-head")
		        .append($headTable);
		
		    if (option.IsSetTableWidth) {
		         $fixHeadDiv.width(columnWidth + "px");
		      }       				 
		    if (option.IsSetheight) {
		        var trHeight = parseInt(option.IsSetheight * 24);
		        if (option.hasOwnProperty("height")) {
		            if (trHeight < option.height) {
		                $fixTableDiv.height(option.height);
		            }
		        }
		    }
		    else {
		        if (option.hasOwnProperty("height"))
		            $fixTableDiv.height(option.height);
		    }
		
		    $fixTableDiv
		        .addClass("fix-table")
		        .append($table)
		
		    if (option.IsSetTableWidth) {
		        $fixTableDiv.width(columnWidth + "px")
		    }
		
		    //var $moveDiv = $("<div id='moveline' style='height:19px; position: absolute; '><p>-----------------</p></div>");
		
		    $wrapper
		        .append($fixHeadDiv)
		        .append($fixTableDiv);
		   this.$tbody=$tbody;
		    $table
		        .empty()
		        .append($tbody)
		        .addClass("table table-bordered table-hover mf-body-table")
		        .keypress(this.onTableKeyPress);
   },
   createThHeader : function (columns) {	  
	 	// 生成表头
	 	var _this_=this,
            $theadTmp = $("<thead>"),
            option=_this_.settings,
            str='序号',columnWidth,
            $theadTr = $("<tr>"),
            fn_createBtn;
        $theadTmp.append($theadTr);
        _this_.columnWidth=1;
        columnWidth=_this_.columnWidth;
        if (!option.noNumColumn) {      
            $theadTr.append('<th style="width:40px;text-align:center;">' + str + '</th>'); // 序号
             columnWidth += 40;
        }

        fn_createBtn = option.fn_createBtn;
        if (fn_createBtn) {
            $theadTr.append('<th style="width:' + option.operateColumWidth + ';text-align:center;">' + option.operateColumTitle + '</th>'); // 操作列
            var operateColumWidth = parseInt(option.operateColumWidth);
            if (!isNaN(operateColumWidth)) {
                columnWidth = columnWidth + operateColumWidth;
            }
        }

        if (option.LastWidth != null) {
            var LastWidth = parseInt(option.LastWidth);
            if (!isNaN(LastWidth)) {
                columnWidth = columnWidth + LastWidth;
            }
        }

        $.each(columns, function (i, column) {
            if (option.enableMultiSelectColumn) {
                if (option.multiSelectColumnIndex === i) {
                    // 设置多选列
                    $theadTr.append($('<th style="width:40px;text-align:center;" >' + option.multiSelectColumnTitle + '</th>'));
                    columnWidth += 40;
                }

            }
            if (column.visible) {
                var $th;
                if (option.IsSort) {
                    $th = $("<th id='" + column.field + "th" + "' title='" + column.title + "'><div style='float: left;width: 88%;'>" + column.title + "</div><div style='width:12%; max-width:11px; float: right;text-align:right !important; margin-top:-1.5px;'>" +
                            "<div class='riseDiv' style='height: 5px; display:block;'><a class='rise fa fa-sort-asc'  style='color:black;height:5px;'></a></div>" +
                            "<div class='downDiv' style='height: 6px; display:block;'><a class='down fa fa-sort-down' style='color:black;height:6px;'></a></div></div></th>");
                }
                else {
                    $th = $("<th title='" + column.title + "'><div style='float: left;width: 83%;'>" + column.title + "</th>");
                }          
                
                $th.data("field", column.field);
//              if (option.columnDraggable) {
//                  $th.draggable({ containment: "parent", revert: true, opacity: 0.7, helper: "clone" });
//                  $th.droppable({
//                      drop: function (event, ui) {
//                          var $dragTh = ui.draggable,
//                              dragField = $dragTh.data("field"),
//                              targetField = $(event.target).data("field"),
//                              dragColumn, dragIndex, targetColumn, targetIndex;
//                          for (var i = 0; i < columns.length; i++) {
//                              if (columns[i].field === dragField) {
//                                  dragColumn = columns[i], dragIndex = i;
//                              } else if (columns[i].field === targetField) {
//                                  targetColumn = columns[i], targetIndex = i;
//                              }
//                          }
//
//                          columns.splice(dragIndex, 1);
//                          columns.splice(targetIndex, 0, dragColumn);                            
//                          var $thead = createThHeader(columns);
//                          $("thead").replaceWith($thead);
//                          self.loadData();
//                      }
//                  })
//              }      
            _this_.setColumnStyle($th, column);
                $theadTr.append($th);
                if (column.hasOwnProperty("width")) {
                    var evercolumnWidth = parseInt(column.width);
                    if (!isNaN(evercolumnWidth)) {
                        columnWidth = columnWidth + evercolumnWidth;
                    }
                }
            }
        });
        return $theadTmp;
  },
   setColumnStyle:function ($column, column) {
	    if (column.hasOwnProperty("class")) {
	            $column.addClass(column.class);
	        }
	
	        if (column.hasOwnProperty("align")) {
	            $column.css("text-align", column.align);
	        }
	
	        if (column.hasOwnProperty("width")) {
	            $column.css("width", column.width);
	        }
    },   // 生成包含在列里的html或对象
   createCell:function (field, rander, rowData) {
        if (!(rowData && rowData.hasOwnProperty(field))) {
            return "";
        }

        var value = rowData[field];
        if (!rander) {
            return value;
        }

        if (!isAdding && !isEditing) {
            return rander.createCell(field, value, rowData);
        }

        var $cell = null;
        if (isAdding) {
            $cell = $(rander.createAddingCell(field, onEditingCellChange, value, rowData));
            if (value != null) {
                rander.setAddingCellValue($cell, value, rowData);
            }
        } else if (isEditing) {
            $cell = $(rander.createEditingCell(field, onEditingCellChange, value, rowData));
            if (value != null) {
                rander.setEditingCellValue($cell, value, rowData);
            }
        }

        return $cell;
    },
    // 生成一行
   createRow :function (index, columns, uniqueIdName, data, undefinedText) {  
   	  var option=this.settings,
   	      _this_=this,
       	  $row,fn_createBtn;
        if (!data) {
            console.error("receive a null data when create row index of:" + index);
            return null;
        }    
        $row = $("<tr>")
                        .data("index", index)
                        .data("uniqueId", data[uniqueIdName]);

        if (!option.noNumColumn) {
            $row.append('<td style="width:40px;text-align:center;">' + (index + 1) + '</td>'); // 序号
        }

        // 生成操作列
         fn_createBtn = option.fn_createBtn;
        if (fn_createBtn) {
            var $operateBtn = fn_createBtn(data);
            if ($operateBtn)
                $row.append($operateBtn);
        }
        
        $.each(columns, function (i, column) {

            if (option.enableMultiSelectColumn) {

                if (option.multiSelectColumnIndex === i) {

                    // 设置多选列
                    var $td = $('<td style="width:40px;text-align:center;">');
                    var $checkbox = $('<input type="checkbox" class="mf-option" />');

                    //为列表每行的多选框添加点击事件，事件名固定为multiSelectAddClickEventName，2017年11月29日17:18:06
                    if (option.multiSelectAddClickEvent && option.multiSelectAddClickEventName) {
                        var $checkbox = $('<input type="checkbox" class="mf-option" onclick="' + option.multiSelectAddClickEventName + '"/>');//多选列加点击事件，2017年11月22日17:32:38
                    }

                    $checkbox.change(function () {
                        if ($checkbox.is(":checked")) {
                            $row.addClass("multiSelected");
                        } else {
                            $row.removeClass("multiSelected");
                        }
                    });
                    $td.append($checkbox);
                    $row.append($td);
                }
            }

            var $td = column.visible ? $("<td>") : $("<td style='display: none;'>"); //單元格判斷是否隱藏，主要用於開窗ID字段保存
            var field = column.field;
            //var rander = column.rander;
           $td.text(data[field]);
//          if (data.hasOwnProperty(field)) {
//              if ((isAdding || isEditing) && column.hasOwnProperty("require") && column.require) {
//                  $td.append('<span class="J-required">*</span>'); // 添加必填样式
//              }
//              $td.append(createCell(field, column.rander, data));
//          } else if (rander) {
//              $td.append(createCell(field, column.rander, null));
//          } else {
//              $td.text(undefinedText);
//          }
            _this_.setColumnStyle($td, column);
            $row.append($td);
            if (option.rowDraggable) {
                $row.draggable({
                    helper: "clone",
                    revert: "invalid"
                });
            }
        });

        $row.unbind("click", _this_.onRowClick); // 用click、on、bind会执行两次click事件
        $row.unbind("dblclick", _this_.onRowDblClick); //双击行事件

        var fn_onEditingRowRandFinish = option.fn_onEditingRowRandFinish;//生成一行的处理事件回调函数可做一些验证操作
        if (fn_onEditingRowRandFinish) {
            fn_onEditingRowRandFinish($row, isAdding, data, isEditing);
        }

        return $row;
    },    // 根据数据生成所有行
   createRows : function (rowsData) {
   	var option=this.settings,_this_=this;
        var columns = option.columns,
            uniqueId = option.uniqueId,
            undefinedText = option.undefinedText,
            $rows = [];

        $.each(rowsData, function (i, data) {
            $rows.push(_this_.createRow(i, columns, uniqueId, data, undefinedText));
        });

        return $rows;
    },  
   loadData :function (searchData, isRemainRecord, resetpage, height) {
   	var _this_=this, option=_this_.settings,
   	     paginationBar,
         pagination = null, rows = null;
//      if (!finishEditing()) {
//          return false;
//      }      
          paginationBar = option.paginationBar;
      //  searchData = $.extend(getSearchData(option.columns), searchData);
        if (paginationBar) {
            pagination = paginationBar.getPagination();
            //返回第一页
            if (resetpage) {
                pagination.page = resetpage;
            }
        }
        option.fn_getData(pagination, searchData, function (data) {
            if (data.hasOwnProperty("rows")) {
                rows = data.rows;
            } else {
                rows = data;
            }
            //返回第一页
            if (resetpage) {
                paginationBar.setPage(resetpage);
            }

            if (!(Object.prototype.toString.call(rows) === "[object Array]")) {
                console.error("data that get from loadData is not a array.");
                return;
            }
            if (data.hasOwnProperty("total")) {
                if (paginationBar) {
                    paginationBar.setTotal(data.total);
                } else {
                    console.warn("you have configure a paginationBar but data have no 'total'");
                }
            }
            if (height) {
                $parent.find('.fix-table').css("height", height);
            }           
          
            _this_.updateRows(rows);
            _this_.rowsData = rows;
            

            if (!isRemainRecord) {
                records = [];
            }
            if (option.isFrozenColumn) {
                $(domStr).parent().parent().scroll(function () {
                    var left = $(this).scrollLeft() - 1;
                    var $head_tr = $(this).find(".mf-head-table").find("tr");
                    var $tr = $(domStr).find("tr");
                    $head_tr.each(function (index) {
                        $(this).children().eq(0).css({
                            "box-shadow": "1px 1px #e7eaec",
                            "background-color": "white",
                            "padding-left": "3px",
                            "position": "relative",
                            "top": "0px",
                            "left": left
                        });
                        $(this).children().eq(1).css({
                            "box-shadow": "1px 1px #e7eaec",
                            "background-color": "white",
                            "padding-left": "3px",
                            "position": "relative",
                            "top": "0px",
                            "left": left
                        });
                    });
                    $tr.each(function (index) {
                        $(this).children().eq(0).css({
                            "box-shadow": "1px 1px #e7eaec",
                            "background-color": "white",
                            "padding-left": "3px",
                            "position": "relative",
                            "top": "0px",
                            "overflow": "inherit",
                            "left": left
                        });
                        $(this).children().eq(1).css({
                            "box-shadow": "1px 1px #e7eaec",
                            "background-color": "white",
                            "padding-left": "3px",
                            "position": "relative",
                            "top": "0px",
                            "overflow": "inherit",
                            "left": left
                        });
                    });
                });
            }

            //isLoadData = false;

        });

        return true;
    },    // 列表按键事件
   onTableKeyPress :function (e) {
        // 捕获回车键
        if (e.which === 13) {
            if (option.enter_addble) {

                self.addRow();

                var fn_onTableEnterPress = option.fn_onTableEnterPress;

                if (fn_onTableEnterPress) {
                    fn_onTableEnterPress();
                }               
            }
        }
   },   // 结束添加行或编辑行
   finishEditing :function (fn_checkPass, fn_checkFail) {
        this.$table.focus(); // 让列表获取一下焦点使列表能及时接受点击回车事件
        var $editingRow = this.$tbody.find(".editingRow");
        if ($editingRow.length <= 0) {
            fn_checkPass && fn_checkPass();
            return true;
        }

        var columns = option.columns;
        var checkResult = checkEditingRow($editingRow, columns);

        if (checkResult) {
            /*
            @editor Alvin
            @time 2017年5月19日15:15:47
            @function 修改检查必输项可修改可刷新的操作
            */
            msg.info(lang.info, checkResult, fn_checkFail);
            return false;
        }

        var index = $editingRow.data("index");
        var oldData = rowsData[index];
        var newData = $.extend(
            oldData,
            getEditingRowData($editingRow, columns));

        if (isAdding) {
            records[newData[option.uniqueId]] = { type: "add", data: newData };
        } else if (isEditing) {
            var id = newData[option.uniqueId];
            if (records.hasOwnProperty(id)) {
                var oldRecord = records[id];
                if (oldRecord.type === "add") {
                    oldRecord.data = newData;
                }
            } else {
                records[id] = { type: "edit", data: newData };
            }
        }

        isAdding = false;
        isEditing = false;

        var $row = createRow(index, columns, option.uniqueId, newData, option.undefinedText);
        $editingRow.replaceWith($row);
        $row.click(onRowClick);
        $row.dblclick(onRowDblClick);
        rowsData[index] = newData;

        fn_checkPass && fn_checkPass();

        return true;
    },
       // 根据数据更新列表里的行
   updateRows :function (rowsData) {
    	var $tbody=this.$tbody,_this_=this;
        $tbody.empty();
        if (rowsData && rowsData.length > 0) {
            $tbody
                .append(_this_.createRows(rowsData))
                .find("tr")
                    .click(_this_.onRowClick)
                    .dblclick(_this_.onRowDblClick);
        }

        //setSumRow(option.sumColumnOptions, rowsData);

       // $wrapper.animate({ scrollLeft: 0 }, 10);

        //找到table的parent id，
       // var $tableScroll = $parent.find('.fix-table');
        //将滚动条处于顶部，取消默认为了记忆之前访问的位置，通常不会处理
      //  $tableScroll.animate({ scrollTop: 0 }, 500);

    },
        // 点击列表行事件
   onRowClick :function () {
        var $row = $(this),option=this.settings;
        var isAreadlySelected = $row.hasClass("active");

        // 当列表中存在编辑行且用户点击到列表其它地方则自动结束编辑行
        if (!$row.hasClass("editingRow")) {
            if (finishEditing()) {
                setRowSelectClass($row);
            }
        } else {
            setRowSelectClass($row);
        }

        if (!isAreadlySelected || option.allowRowClick) {
            var fn_onRowClick = option.fn_onRowClick;
            if (fn_onRowClick) {
                fn_onRowClick(self.getSelectedData());
            }
        }
    },
    // 双击列表行事件
   onRowDblClick :function () {
        if (option.dblclick_editable) {

            var fn_onRowDBlClick = option.fn_onRowDBlClick;

            if (fn_onRowDBlClick) {
                fn_onRowDBlClick();
            }

            self.editRow();
        }
    }






		   	
   	
   	
   }
	
	window.Table=Table;
})(jQuery,window);
