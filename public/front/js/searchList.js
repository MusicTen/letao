$(function () {
  //从地址栏获取拼接的数据
  // function getLocation(key) {
  //   var search = location.search;
  //   // 对中文解码, 得到 ?name=pp&age=18&desc=帅
  //   search = decodeURI(search);
  //   search = search.slice(1);
  //   var arr = search.split("&");
  //   var obj = {};
  //   arr.forEach(function (v, i) {
  //     var key = v.split("=")[0];
  //     var value = v.split("=")[1];
  //     obj[key] = value;
  //   })
  //   return obj[key];
  // }
    
  // 1. 一进入页面, 解析地址栏参数, 将值设置给input, 再进行页面渲染
  // 获取搜索关键字
  var key = getLocation("key");
  // console.log(key);
  $(".search_btn").val(key);
  render()

  function render() {
    //懒加载
    $(".lt-product").html('<div class="loading"></div>')

    var params = {};
    params.proName = $(".search_btn").val();
    params.page = 1;
    params.pageSize = 100;
    // 还有两个可传的参数 price 和 num
    // 根据当前高亮的 a 来决定按什么排序,  1升序，2降序
    var currentA =  $(".lt_sort .current")
    if(currentA.length>0) {
      var sortName = currentA.data("type");
      var sortValue = currentA.find("i").hasClass("fa-angle-down")?2:1;
      params[sortName] = sortValue;
    }

    // 模拟网络延迟
    setTimeout(function() {
      $.ajax({
        type: "get",
        url: "/product/queryProduct",
        data: params,
        dataType: "json",
        success: function (info) {
          console.log(info);
          var htmlStr = template("tmp",info);
          $(".lt-product").html(htmlStr);

        }
      })
    },1000)
  }
  // 2. 点击搜索按钮, 进行搜索功能, 历史记录管理
  $(".search_btn").click(function(){
    var key = $(".search_input").val();
    if(!key){
      mui.toast('请输入搜索关键词');
      return;
    }
  
    var history = localStorage.getItem('search_list');
    var arr = JSON.parse(history);
    
    if(arr.length>=10){
      arr.pop()
    }
    var index = arr.indexOf(key)
    if(index>-1){
      arr.splice(index,1)
    }
    arr.unshift(key);
    localStrage.setItem("search_list",JSON.stringify(arr))
    render();
    $(".search_input").val("");
  });
  // 3. 添加排序功能
  // (1) 添加点击事件
  // (2) 如果没有current, 就要加上current, 并且其他 a 需要移除 current
  //     如果有 current, 切换小箭头方向即可
  // (3) 页面重新渲染
  $(".lt_sort a[data-type]").click(function(){
    if($(this).hasClass("current")){
      $(this).find("i").toggleClass("fa-angle-down").toggleClass("fa-angle-up");
    } else {
      $(this).addClass("current").siblings().removeClass('current')
    }
    render();
  })
})