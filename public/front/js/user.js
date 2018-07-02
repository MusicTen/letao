$(function(){
  $.ajax({
    type: 'get',
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function(info) {
      // console.log(info);
      var htmlStr = template("tmp",info);
      $(".lt_main .mui-media").html(htmlStr);
    }
  })
  $(".logoutBtn").click(function(){
    $.ajax({
      type: 'get',
      url: "/user/logout",
      dataType: "json",
      success: function(info) {
        // console.log(info);
        if(info.success){
          location.href = "login.html"
        }
      }
    })
  })
})