$(function () {
  $("#loginBtn").click(function () {
    var username = $('[name="username"]').val();
    var password = $('[name="password"]').val();
    console.log(username);
    if (!username) {
      mui.toast("请输入用户名");
      return;
    }
    if (!password) {
      mui.toast("请输入密码");
      return;
    }
    $.ajax({
      type: "post",
      url: "/user/login",
      data: {
        username: username,
        password: password
      },
      dataType: "json",
      success: function (info) {
        if (info.error === 403) {
          mui.toast("用户名或密码错误");
          return;
        }
        if (info.success) {
          if (location.href.indexOf("?url=") > -1) {
            var url = location.search.replace("?url=",'');
            // var url = location.search.splice('5');
            location.href = url;
          } else {
            location.href = "user.html"
          }
        }
      }
    })
  })


})