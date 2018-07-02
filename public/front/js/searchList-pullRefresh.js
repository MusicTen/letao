$(function () {
  var currentPage = 1;
  var pageSize = 2;

  function render(callback) {
    var params = {};
    params.praName = $(".search_input").val();
    params.page = currentPage;
    params.pageSize = pageSize;
    if ($(".lt_sort .current").length > 0) {
      var type = $(".lt_sort .current").data("type");
      var value = $(".lt_sort .current i").hasClass("fa-angle-down") ? 2 : 1;
      params[type] = value;
    }
    setTimeout(function () {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function (info) {
          console.log(info);
          callback && callback(info);
        }
      })
    }, 500)
  }
  //利用mui
  mui.init({
    pullRefresh: {
      container: ".mui-scroll-wrapper", //刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      //下拉刷新
      down: {
        auto: true, //可选,默认false.首次加载自动下拉刷新一次
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          currentPage = 1;
          render(function (info) {
            var htmlStr = template("tmp", info);
            $(".lt-product").html(htmlStr);
            // console.log(mui('.mui-scroll-wrapper').pullRefresh());
            //数据请求成功后,关闭"正在刷新"
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
            //在下拉刷新后,重新启动上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          })
        }
      },
      //上拉加载
      up: {
        callback: function () { //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
          currentPage++;
          render(function (info) {
            if (info.data.length === 0) {
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
            } else {
              var htmlStr = template("tmp", info);
              $(".lt-product").append(htmlStr);
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh();
            }
          })
        }
      }
    }
  })
  // 给每个商品添加点击事件
  // 1) 给 a 标签添加链接, 在下拉刷新中, 点不了
  // 2) 考虑添加点击事件进行页面跳转, click 事件有 300ms延迟, 需要使用 tap 事件
  // 3) 光跳转没用, 还需要传递 productId 通过自定义属性的方式存储在 a 标签内

  // tap 事件表示轻触, 轻轻的摸
  // mui 中认为 click 事件, 有 300ms的延迟, 通过 tap 来绑定事件会更合适
  $(".lt-product").on("tap", "a", function () {
    location.href = "product.html?productId=" + $(this).data('id');
  })
  // 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  // 获取搜索关键字
  var search = getLocation('key');
  $(".search_input").val(search);

  // 2. 点击搜索按钮, 进行搜索功能, 历史记录管理
  $(".search_btn").click(function () {
    var key = $(".search_input").val();
    if (!key) {
      mui.toast("请输入搜索关键字");
      return;
    }
    var history = localStorage.getItem("search_list") || "[]";
    var arr = JSON.parse(history);
    var index = arr.indexOf(key);
    if (index > -1) {
      arr.splice(index, 1);
    }
    arr.unshift(key);
    localStorage.setItem("search_list", JSON.stringify(arr));

    // 重新渲染页面,调用下拉刷新即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    //清空搜索框
    $(".search_input").val();
  })
  // 3. 添加排序功能
  // (1) 添加点击事件
  // (2) 如果没有current, 就要加上current, 并且其他 a 需要移除 current
  //     如果有 current, 切换小箭头方向即可
  // (3) 页面重新渲染
  $(".lt_sort a[data-type]").on("tap",function () {
    if ($(this).hasClass("current")) {
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $(this).addClass("current").siblings().removeClass("current");
    }
    // 重新渲染页面,调用下拉刷新即可
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })
})