$(function(){
  // 1. 一进入页面, 发送 ajax 请求, 获取数据, 进行页面渲染
  var currentPage = 1;
  var pageSize = 5;
  render();
  function render(){
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("tmp",info);
        $(".table tbody").html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:currentPage,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"normal",//设置控件的大小，mini, small,normal,large
          onPageClicked:function(event, originalEvent, type, page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
        
      }
    })
  }
  // 2. 点击添加分类按钮, 显示模态框
  $('.addBtn').click(function(){
    $("#addModal").modal("show");
    //渲染下拉菜单
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize:10,
      },
      dataType: "json",
      success: function(info){
        console.log(info);
        var htmlStr = template('tlp',info);
        $('#addModal .dropdown-menu').html(htmlStr);
      }
    })
  });
  // 3. 给 dropdown-menu 注册委托事件, 让 a 可以被点击
  $("#addModal .dropdown-menu").on("click",'a',function(){
    var id = $(this).data('id');
    $("#dropdownTxt").html($(this).text());
    $(".categoryId").val(id)
    // 用户选择了一级分类后, 需要将 name="categoryId" input 框的校验状态置成 VALID
    // 参数1: 字段名, 参数2: 设置成什么状态, 参数3: 回调(配置提示信息)
    $("#form").data('bootstrapValidator').updateStatus("categoryId",'VALID');
  });
  // 4. 进行 jquery-fileupload 实例化, 里面配置图片上传后的回调函数
  $("#fileupload").fileupload({
    dataType:"json",
    //文件上传完成时，会执行的回调函数，通过这个函数就能获取到图片的地址
    //第二个参数就有上传的结果 data.result
    done:function (e, data) {
      //console.log("图片上传完成拉");
      //console.log(data);
      //console.log(data.result.picAddr);
      var picUrl = data.result.picAddr; // 上传后得到的图片地址
      $("#imgBox img").attr("src", picUrl);
      $('[name="brandLogo"]').val(picUrl);
      // 手动将表单校验状态重置成 VALID
      $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  }); 
  // 5. 通过表单校验插件实现表单校验功能
  $('#form').bootstrapValidator({
    //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryId:{
        validators:{
          notEmpty:{
            message:"请选择一级分类"
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: "请上传图片"
          }
        }
      }
    }
  });
  // 6. 注册表单校验成功事件, 阻止默认提交, 通过 ajax 提交
  $("#form").on('success.form.bv',function(e){
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/category/addSecondCategory",
      data: $("#form").serialize(),
      dataType: 'json',
      success: function(info){
        $("#addModal").modal("hide");
        currentPage = 1;
        render();
        //传true,重置状态和内容
        $("#form").data('bootstrapValidator').resetForm(true);
        $("#dropdownTxt").text('请选择一级分类');
        $("#imgBox img").attr('src','./images/none.png')
      }
    })
  })
})