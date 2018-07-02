$(function () {
  var id = getLocation("productId");
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: id
    },
    datatype: 'json',
    success: function (info) {
      console.log(info);
      var htmlStr = template("tmp", info);
      $(".lt_main .mui-scroll").html(htmlStr);

      //手动调用图片轮播的初始化方法
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
      });
      //动态添加的Numbox组件需要手动初始化
      mui(".mui-numbox").numbox()
    }
  })
  //选中的尺码,加上current类
  $(".lt_main").on("click",".lt_size span",function(){
    $(this).addClass("current").siblings().removeClass("current");

  });
  $("#goCart").click(function(){
    var size = $(".lt_size span.current").text();
    var num = $(".lt_num .mui-numbox-input").val();
    var productId = id;
    // console.log(size,num)
    $.ajax({
      type: "post",
      url: "/cart/addCart",
      data: {
        productId: productId,
        size: size,
        num: num
      },
      dataType: "json",
      success: function(info) {
        // console.log(info);
        if(info.error === 400) {
          location.href = "login.html?url="+location.href;
        }
        if(info.success) {
          mui.confirm("添加成功","温馨提示",["去购物车","继续浏览"],function(e){
            if(e.index===0) {
              location.href = "cart.html"
            }
          })
        }
       }
    })
  })
})