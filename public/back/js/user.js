$(function(){
  var currentPage = 1;
  var pageSize = 5;
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/user/queryUser",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        var htmlStr = template("tmp", info);
        $(".table tbody").html(htmlStr);
        $("#pagintor").bootstrapPaginator({
          bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
          currentPage:currentPage,//当前页
          totalPages: Math.ceil(info.total/info.size),//总页数
          size:"normal",//设置控件的大小，mini, small, normal,large
          onPageClicked:function(event, originalEvent, type,page){
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    })
  };
  $(".table tbody").on("click","button",function(){
    $("#userModal").modal('show');
    var id = $(this).parent().data("id");
    var isDelete = $(this).hasClass("btn-danger")?0:1;
    $("#submitBtn").click(function(){
      $.ajax({
        type: "post",
        url: "/user/updateUser",
        data: {
          id:id,
          isDelete:isDelete
        },
        dataType: "json",
        success: function(info) {
          // console.log(info);
          if(info.success) {
            //关闭模态框
            $("#userModal").modal('hide');
            //重新渲染页面
            render();
          }
        }
      })
    })
  })
})