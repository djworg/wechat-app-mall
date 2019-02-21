// pages/cashier/cashier.js
const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
const wxpay = require('../../utils/pay.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined,
    showalipay: false
  },
  /**
   * 余额支付
   */
  balancePay: function (orderId, amount) {
    var that = this;
    WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
      that.onShow();
    });
  },
  /**
      * 支付
      */
  comboPay:function (orderId, amount) {
    var that = this;
    var loginToken = wx.getStorageSync('token'); // 用户登录 token
    WXAPI.userAmount(loginToken).then(function (res) {
      if (res.code == 0) {
        var temp = amount - res.data.balance;
        if (temp > 0) {//余额不足
          //先充值，再支付
          wxpay.wxpay(app, temp, orderId, "");
          //使用余额支付
          that.balancePay(orderId, amount);
        } else {
          //直接使用余额支付
          that.balancePay(orderId, amount);
        }
      } else {
        wx.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false
        })
      }
    });
  },
  /**
 * 使用余额支付，先创建订单   改商品每件单价为1元
 */
  createOrderAndPay: function (goodsId, amount) {
    wx.showLoading();
    var that = this;
    var loginToken = wx.getStorageSync('token') // 用户登录 token
    var num = parseInt(amount * 10);
      var that = this;
      var remark = "使用余额支付"; // 备注信息
      var postData = {
        token: loginToken,
        goodsJsonStr: '[{"goodsId": ' + goodsId + ',"number":' + num + '}]',
        remark: remark
      };
     WXAPI.orderCreate(postData).then(function (res) {
        if (res.code != 0) {
            wx.hideLoading();
            wx.showModal({
              title: '错误',
              content: res.msg,
              showCancel: false
            })
            return;
        }
        console.log(res.data.id+"_------"+amount);
       that.comboPay(res.data.id, amount);
      });
      
  },
  confirmPay: function (e) {
    console.log(e)
    var that = this;
    var amount = e.detail.value.amount;
    var type = e.detail.value.type;
    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确金额',
        showCancel: false
      })
      return
    }
    switch(type){
      case 'pay':{
        // 微信支付
        var goodsId = '117861';
        that.createOrderAndPay(goodsId, amount);
        
      };
      break;
      case 'recharge':{
        // 充值
        
        wxpay.wxpay(app, amount, 0, "/pages/cashier/index");
      };
      break;
    }
    
  },
  
  /**
   * 获得用户余额
   */
  getUserAmount: function () {
    var that = this;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        that.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score
        });
      }
    })
  },
  




/**
 * 获得充值活动
 */
  getRechargeActivity(){
    var that = this;
    // 获取充值活动优惠
    WXAPI.queryConfig({
      key: 'recharge-config'
    }).then(function (res) {
      if (res.code == 0) {
        // var arr = res.data.value;
        // that.setData({
        //   rechargeDic: arr,
        // });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid: wx.getStorageSync('uid');
    //获得当前账户余额
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUserAmount();
    this.getRechargeActivity();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})