$(function () {
  // 在进行搜索历史记录管理时, 需要维护一个数组, 这个数组需要存在本地存储中
  // 我们约定一个键名, 键名: search_list
  var search_list = [];

  // 功能1: 搜索历史记录渲染功能
  // (1) 获取本地存储中存储的数据 jsonStr
  // (2) 转换成数组
  // (3) 将数组, 通过模板引擎渲染历史记录

  render();
  // 获取历史记录数组
  function getHistory() {
    var history = localStorage.getItem("search_list") || '[]';
    var arr = JSON.parse(history);
    return arr;
  }

  function render() {
    var arr = getHistory();
    var htmlStr = template("tmp", {arr: arr});
    $(".lt_history").html(htmlStr);
  };
  // 功能2: 清空历史记录功能
  // (1) 给清空按钮添加点击事件, 通过事件委托
  // (2) 将 search_list 从本地存储中删除  使用 removeItem
  // (3) 页面需要重新渲染
  $(".lt_history").on("click", ".icon_empty", function () {
    mui.confirm("你是否要清空全部的历史记录?", "温馨提示", ['取消', '确认'], function (e) {
      // console.log(e);
      if (e.index == 1) {
        localStorage.removeItem("search_list");
        render();
      }
    })
  })
  // 功能3: 删除一条记录的功能
  // (1) 点击删除按钮, 删除该条记录, 添加点击事件 (事件委托)
  // (2) 将 数组下标存储在 标签中, 将来用于删除
  // (3) 获取 下标, 根据下标删除数组的对应项  arr.splice( index, 1 );
  // (4) 将数组存储到本地历史记录中
  // (5) 重新渲染
  $(".lt_history").on("click", ".icon_delete", function () {
    var that = this;
    mui.confirm("你是否要删除这条历史记录?", "温馨提示", ['取消', '确认'], function (e) {
      var index = $(that).data('index');
      var arr = getHistory();
      arr.splice(index,1);
      localStorage.setItem('search_list',JSON.stringify(arr));
      render()
    })
  })
  // 功能4: 添加搜索记录功能
  // (1) 给搜索按钮添加点击事件
  // (2) 获取搜索关键字
  // (3) 获取数组
  // (4) 添加到数组最前面
  // (5) 存储到本地历史记录中
  // (6) 重新渲染
  $(".search_btn").click(function(){
    var key = $(".search_input").val();
    //非空判断
    if(!key){
      mui.toast('请输入搜索关键词')
      return;
    }
    var arr = getHistory();

    //如果有相同的要先删除,在添加
    //arr长度限制10个,删去最老的
    if(arr.length>=10){
      arr.pop()
    }
    console.log(arr)
    var index = arr.indexOf(key)
    if( index >-1){
      arr.splice(index,1)
    }
    arr.unshift(key);
    localStorage.setItem("search_list",JSON.stringify(arr));
    render();
    $(".search_input").val("");


    //进行页面跳转
    location.href="searchList.html?key="+key;
  })
})