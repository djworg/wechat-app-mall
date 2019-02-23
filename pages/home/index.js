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
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
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