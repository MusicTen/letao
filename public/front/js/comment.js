$(function () {
  //区域滚动
  mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    indicators: false, //是否显示滚动条
  });

  //获得slider插件对象
  var gallery = mui('.mui-slider');
  gallery.slider({
    interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
  });
})

//从地址栏获取拼接的数据
function getLocation(key1) {
  var search = location.search;
  //对中文解码
  search = decodeURI(search);
  search = search.slice(1);
  var arr = search.split("&");
  var obj = {}
  arr.forEach(function(v,i){
    var key = v.split("=")[0];
    var value = v.split("=")[1];
    obj[key] = value;
  })
  return obj[key1];
}
