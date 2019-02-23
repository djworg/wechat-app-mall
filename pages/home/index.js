// pages/home/index.js
const wxpay = require('../../utils/pay.js')

const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 支付，跳转支付页面
   */
  pay: function (e) {
    wx.navigateTo({
      url: "/pages/cashier/cashier"
    })
    // var that = this;
    // var orderId = e.currentTarget.dataset.id;
    // var money = e.currentTarget.dataset.money;
    // var needScore = e.currentTarget.dataset.score;
    // WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
    //   if (res.code == 0) {
    //     // res.data.data.balance
    //     money = money - res.data.balance;
    //     if (res.data.score < needScore) {
    //       wx.showModal({
    //         title: '错误',
    //         content: '您的积分不足，无法支付',
    //         showCancel: false
    //       })
    //       return;
    //     }
    //     if (money <= 0) {
    //       // 直接使用余额支付
    //       WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function (res) {
    //         that.onShow();
    //       })
    //     } else {
    //       wxpay.wxpay(app, money, orderId, "/pages/home/index");
    //     }
    //   } else {
    //     wx.showModal({
    //       title: '错误',
    //       content: '无法获取用户资金信息',
    //       showCancel: false
    //     })
    //   }
    // })
  },

/**
 * 预约，直接打开微信客服
 */
  dating:{

  },

/**
 * 充值优惠，从服务器中获得冲x送y的参数，再进行充值
 */
  charge:{},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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