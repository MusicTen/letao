$(function () {
  var currentPage = 1;
  var pageSize = 5;
  // 1. 一进入页面进行一次渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tmp", info);
        $(".lt_main tbody").html(htmlStr);
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //默认是2，如果是bootstrap3版本，这个参数必填
          currentPage: info.page, //当前页
          totalPages: Math.ceil(info.total / info.size), //总页数
          size: "normal", //设置控件的大小，mini, small, normal,large
          //控制每个操作按钮的显示文字
          itemTexts: function (type, page, current) {
            // console.log(type);
            switch (type) {
              case "page":
                return page;
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "first":
                return "首页";
            }
          },
          //设置操作按钮的title属性
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "page":
                return "前往第" + page + "页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "prev":
                return "上一页";
              case "first":
                return "首页";
            }
          },
          // 使用 bootstrap 的提示框
          useBootstrapTooltip: true,
          onPageClicked: function (event, originalEvent, type, page) {
            //为按钮绑定点击事件 page:当前点击的按钮值
            currentPage = page;
            render();
          }
        });
      }
    })
  }
  // 2. 点击添加商品显示模态框
  $(".addBtn").click(function () {
    $("#addModal").modal("show");
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 10
      },
      dataType: "json",
      success: function (info) {
        // console.log(info);
        var htmlStr = template("tpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    })
  })
  // 3. 通过事件委托, 给每个a添加点击事件
  $(".dropdown-menu").on("click", 'a', function () {
    var txt = $(this).text();
    $("#dropdownTxt").text(txt);
    var id = $(this).data("id");
    $('.brandId').text(id)
    //手动给修改验证状态
    $("#form").data('bootstrapValidator').updateStatus("brandId","VALID");
  })
  // 4. 进行图片上传初始化
  var arrPic = [];
  // 文件上传说明
  // 上传三张图片, 将来服务器端一旦存好一张, 就会响应一张
  // 将来每次响应一次, 就会调用一次 done 方法, 这样用户体验是最好的
  // jquery-fileupload 对文件的上传提交进行了封装, 每次选择完图片后, 就会向接口发送请求上传图片
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data.result);
      arrPic.push(data.result);
      var picUrl = data.result.picAddr;
      $("#imgBox").prepend('<img src=' + picUrl + ' width="100">');
      if (arrPic.length > 3) {
        arrPic.pop();
        $("#imgBox img:last-of-type").remove();
      };
      //手动给修改验证状态
      if(arrPic.length === 3) {
        $("#form").data('bootstrapValidator').updateStatus("picStatus","VALID");
      }
      // console.log(arrPic);
    }
  });
  // 5. 通过表单校验插件, 实现表单校验
  $("#form").bootstrapValidator({
    // 需要对隐藏域进行校验, 所以配置一下
    excluded: [],
    //图标配置
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    // 配置校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          //正则校验
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          //正则校验
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是xx-xx格式,如32-46'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  })
  // 6. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    //使用ajax提交逻辑
    var data = $("#form").serialize();
    data += "$picName1="+arrPic[0].picName+"$picAddr1"+arrPic[0].picAddr;
    data += "$picName2="+arrPic[1].picName+"$picAddr2"+arrPic[1].picAddr;
    data += "$picName3="+arrPic[2].picName+"$picAddr3"+arrPic[2].picAddr;
    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: data,
      dataType: 'json',
      success: function(info) {
        $("#addModal").modal('hide');
        currentPage = 1;
        render();
        $("#form").data("bootstrapValidator").resetForm(true);
        $("#dropdownTxt").text("请选择二级分类");
        $("#imgBox img").remove();
      }
    })
  });
})