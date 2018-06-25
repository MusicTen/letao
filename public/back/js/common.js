









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














