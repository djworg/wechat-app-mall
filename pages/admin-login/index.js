const BACKENDAPI = require('../../wxapi/backend.js')
const CONFIG = require('../../wxapi/config.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  getCode(){
    var that = this;
    var ranKey = Math.random();
    console.log(ranKey);
    var uri = BACKENDAPI.getCodeUri();
    uri += ranKey;
    that.setData({
      "uri": uri,
      "ranKey":ranKey
    });
  },
  /**
   * 登录
   */
  login: function(e){
    var that = this;
    var uname = e.detail.value.uname;
    var pass = e.detail.value.pass;
    var code = e.detail.value.code;
    var k = that.data.ranKey;
    var data = {
      "userName":uname,
      "pwd":pass,
      "imgcode":code,
      "k":k,
      "rememberMe":true,
      "pdomain": CONFIG.subDomain
    };
    
    BACKENDAPI.adminManualLogin(data).then(function(res){
      if(res.code == 0){
        wx.setStorage({
          key: 'uname',
          data: uname,
        });
        wx.setStorage({
          key: 'pass',
          data: pass,
        })
        //存储token
        wx.setStorageSync('x_token', res.data);
        wx.redirectTo({
          url: '/pages/admin-page/index',
        })
      }else{
        wx.showModal({
          title: '登录失败',
          content: res.msg,
        })
        changeCode();
      }
    });
  },
  
  changeCode:function(){
    console.log('changeCode');
    this.getCode();
  },

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
    this.getCode();
    this.setData({
      uname:wx.getStorageSync('uname'),
      pass:wx.getStorageSync('pass')
    });
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