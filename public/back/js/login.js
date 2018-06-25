$(function(){
  /* 
    1.进行表单校验配置
      (1)用户名不能为空,长度为2-6位;
      (2)密码不能为空,长度位6-12位
  */
  $("#form").bootstrapValidator({
    //配置图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyicon-refresh'
    },
    //指定字段
    fields: {
      username:{
        //配置校验规则
        validators: {
          //非空校验
          notEmpty: { 
            message: "用户名不能为空"
          },
          //配置长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须在2-6位"
          },
          callback: {
            message: "用户名不存在"
          }
        }
      },
      password:{
        validators: {
          notEmpty:{
            message: "密码不能为空"
          },
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须在6-12位"
          },
          callback: {
            message: "密码错误"
          }
        }
      }
    }
  })

  /* 
    2.使用submit按钮,进行提交,表单校验插件会在提交时,进行校验
      (1) 如果校验成功,会默认提交这次请求,会进行跳转,我们需要阻止这次提交,通过ajax提交
      (2) 如果校验失败,会提示用户, 输入有误
      需要在注册表单校验成功事件,在成功事件内,阻止默认的表单提交
  */
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      dataType: "json",
      success: function( info ){
        console.log(info)
        if ( info.success ) {
          // alert("登录成功")
          location.href = "index.html";
        }
        // console.log($("#form").data("bootstrapValidator"))
        if ( info.error === 1000 ) {
          // alert("用户名错误")
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        } 
        if ( info.error === 1001 ) {
          // alert("密码错误")
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }
      }
    })
  });
  /* 
    3.重置表单bug,重置表单不仅要重置内容,还要重置校验状态
  */
  $('[type="reset"]').click(function(){
    $("#form").data("bootstrapValidator").resetForm();
  });

});








