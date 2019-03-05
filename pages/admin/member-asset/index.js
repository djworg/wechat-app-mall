const app = getApp()
const BACKENDAPI = require('../../../wxapi/backend')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00,
    freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    cashlogs: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.userAmount(options.mobile);
    this.cashLogs(options.mobile);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
  },

  /**
   * 获取用户余额
   */
  userAmount:function(mobile){
    var _this = this;
    var data = {
      "x_token": wx.getStorageSync('x_token'),
      "mobile": mobile
    };
    BACKENDAPI.userAmount(data).then(function (res) {
      if (res.code == 0) {
        _this.setData({
          balance: res.data.result[0].balance.toFixed(2),
          freeze: res.data.result[0].freeze.toFixed(2),
          totleConsumed: res.data.result[0].totleConsumed.toFixed(2),
          score: res.data.result[0].score
        });
      }
    })
  },
  cashLogs: function (mobile){
    var _this = this;
    var data = {
      "x_token": wx.getStorageSync('x_token'),
      "mobile": mobile,
      "pageSize":50,
      "page":1
    };
    // 读取资金明细
    BACKENDAPI.cashLogs(data).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data.result
        })
      }
    })
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