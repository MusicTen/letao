$(function(){
  var currentPage = 1;
  var pageSize = 5;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("tmp",info);
        $(".table tbody").html(htmlStr);
        //分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:currentPage,//当前页
          totalPages:Math.ceil(info.total/info.size),//总页数
          size:"normal",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent,type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    })
  }
  $(".addBtn").click(function(){
    $("#addModal").modal("show");
  })
  $("#form").bootstrapValidator({
    //指定校验时的图标显示
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    //指定校验字段
    fields: {
      //字段名
      categoryName: {
        validators: {
          //非空校验
          notEmpty: {
            message: "一级分类名不能为空"
          }
        }
      }
    }
  });
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      success: function(info) {
        // console.log( info );
        $("#form").data('bootstrapValidator').resetForm();
        $("#addModal").modal("hide");
        render();
      }
    })
  })
})