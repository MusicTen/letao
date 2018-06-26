// 5. 如果当前用户没有登录, 需要拦截到登陆页面
//    前端是不知道用户是否登陆了的, 但是后台知道, 想知道, 问后台, (访问后台接口即可)
//    注意: 需要将登录页, 排除在外面, 就是登录页可以不登录就访问的
if ( location.href.indexOf("login.html") === -1) {
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType:"json",
    success: function(info) {
      if ( info.error === 400 ) {
        location.href = "login.html"
      }
      if ( info.success ) {
        console.log("当前用户已登陆");
      }
    }
  })
}





//实现进度条功能(给ajax请求加),注意需要给所有的ajax都加
//发送ajax 开启进度条, ajax 结束,关闭进度条

//ajax 全局事件
//.ajaxComplete() 每个ajax完成时调用
//.ajaxSuccess()  每个ajax成功时调用
//.ajaxError()    每个ajax失败时调用
//.ajaxSend()     每个ajax发送前调用

//.ajaxStart()    第一个ajax发送时调用
//.ajaxStop()     所有的ajax请求都完成时调用

$(document).ajaxStart(function(){
  NProgress.start();
})
$(document).ajaxStop(function(){
  //模拟网络延迟
  setTimeout(function(){
    NProgress.done()
  },500)
})

// 公共功能
$(function(){
  //1.分类页的显示隐藏
  $('.nav .category').click(function(){
    $(".lt_aside .child").stop().slideToggle();
  });
  //2.侧边栏的显示与隐藏
  $(".icon_menu").click(function(){
    $(".lt_aside").toggleClass("hidemain");
    $(".lt_main").toggleClass("hidemain");
    $(".lt_main .lt_topbar").toggleClass("hidemain");
  })
  //3.登出模态框显示与隐藏
  $(".icon_logout").click(function(){
    $('#lgout').modal("show");
  });
  //4.点击模态框中的退出按钮, 需要进行退出操作(ajax)
  $("#logoutBtn").click(function(){
    $.ajax({
      type:"get",
      url:"/employee/employeeLogout",
      dataType:"json",
      success: function(info) {
        if( info.success ) {
          location.href = "login.html";
        }
      }
    })
  });
});













