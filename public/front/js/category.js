$(function () {
  //渲染一级分类
  $.ajax({
    type: "get",
    url: "/category/queryTopCategory",
    dataType: 'json',
    success: function (info) {
      console.log(info);
      var htmlStr = template("tmp", info);
      $(".lt_category_left ul").html(htmlStr);
      renderId(info.rows[0].id);
    }
  });
  //点击重新渲染
  $(".lt_category_left ul").on("click",'li',function(){
    $(this).addClass("current").siblings().removeClass("current");
    var id = $(this).find("a").data('id');
    renderId(id);
  })
  //根据id渲染商品
  function renderId(id) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id:id
      },
      dataType: "json",
      success: function(info) {
        console.log(info)
        var htmlStr = template("tpl",info);
        $(".lt_category_right ul").html(htmlStr);
      }
    })
  }
})