const wxpay = require('../../utils/pay.js')
const app = getApp()
const BACKENDAPI = require('../../wxapi/backend')
const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
Page({
  data: {
    statusType: ["待核销", "已核销", "已完成"],
    currentType: 1,
    statusValue: [1, 3, 4],
    tabClass: ["", "", ""]
  },
  statusTap: function (e) {
    const curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  orderDetail: function (e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/order-details/index?id=" + orderId
    })
  },
  cancelOrderTap: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function (res) {
        if (res.confirm) {
          WXAPI.orderClose(orderId, wx.getStorageSync('token')).then(function (res) {
            if (res.code == 0) {
              that.onShow();
            }
          })
        }
      }
    })
  },
  hxOrderTap: function (e) {
    var that = this;
    var hxNumber = e.currentTarget.dataset.hxnumber;
    wx.showModal({
      title: '提示',
      content: '是否确认核销该订单',
      showCancel: true,//是否显示取消按钮
      cancelText: "否",//默认是“取消”
      confirmText: "是",//默认是“确定”
      // confirmColor: 'skyblue',//确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          return;
        } else {
          //点击确定
          that.hxOrder(hxNumber);
        }
      }
    });
    
  },
  hxOrder: function (hxNumber){
    var that = this;
    var x_token = wx.getStorageSync('x_token');
    var data = {
      hxNumber: hxNumber,
      token: wx.getStorageSync('token')
    }
    BACKENDAPI.hxOrder(data).then(function (res) { 
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '订单成功核销',
          showCancel: false
        });
        that.setData({
          currentType: 1
        });
        that.onShow();
      }else{
        wx.showModal({
          title: '失败',
          content: '无法核销订单，服务器错误',
          showCancel:false
        })
      }
      
    });

  },
  onLoad: function (options) {
    
    this.checkTokenExpire();
    if (options && options.type) {
      this.setData({
        currentType: options.type
      });
    }
  },
  kAsset: function(){
    wx.navigateTo({
      url: '../k-asset/index'
    })
  },
  //检查是否需要重新登录，如果需要，则登陆
  checkTokenExpire: function(){
    var that = this;
    var data = {
      "x_token": wx.getStorageSync('x_token')
    };
    BACKENDAPI.isTokenExpire(data).then(function(res){
      if(res.code != 0){
        that.adminLogin();
      }
    });
  },
  adminLogin:function(){
    //先检查token是否过期
    
    var postData = {
      merchantKey: CONFIG.key,
      merchantNo: CONFIG.merchantNo
    };

    BACKENDAPI.adminLogin(postData).then(function (res) {
      if (res.code == 0) {
        wx.setStorageSync('x_token', res.data);
      } else {
        wx.showModal({
          title: '提示',
          content: '管理员认证失败',
        })
        wx.navigateBack();
      }
    });

  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  getOrderStatistics: function () {
    var that = this;
    WXAPI.orderStatistics(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        var tabClass = that.data.tabClass;
        if (res.data.count_id_no_pay > 0) {
          tabClass[0] = "red-dot"
        } else {
          tabClass[0] = ""
        }
        if (res.data.count_id_no_transfer > 0) {
          tabClass[1] = "red-dot"
        } else {
          tabClass[1] = ""
        }
        if (res.data.count_id_no_confirm > 0) {
          tabClass[2] = "red-dot"
        } else {
          tabClass[2] = ""
        }
        if (res.data.count_id_no_reputation > 0) {
          tabClass[3] = "red-dot"
        } else {
          tabClass[3] = ""
        }
        if (res.data.count_id_success > 0) {
          //tabClass[4] = "red-dot"
        } else {
          //tabClass[4] = ""
        }

        that.setData({
          tabClass: tabClass,
        });
      }
    })
  },
  onShow: function () {
    // 获取订单列表
    var that = this;
    var postData = {
      x_token: wx.getStorageSync('x_token'),
      pageSize:10,
    };
    postData.status = that.data.currentType;
    this.getOrderStatistics();
    BACKENDAPI.orderList(postData).then(function (res) {
      if (res.code == 0) {
        that.setData({
          orderList: res.data.result,
          usersMap: res.data.apiExtUserMap
        });
      } else {
        that.setData({
          orderList: null,
          usersMap: {}
        });
      }
    })
  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  }
})