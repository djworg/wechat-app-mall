//余额扣除 pages/k-asset/index.js

const BACKENDAPI = require('../../wxapi/backend')
Page({
  checkPhone: function(mobile){
    if(mobile.length != 11) {
    
      return 手机号长度有误;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'success',
        duration: 1500
      });
      return "手机号拼写有误";
    }
    return "";
  },
/**
 * 从会员账户中扣除
 */
  deductFAsset:function(e){
    var that = this;
    var amount = e.detail.value.amount;
    var phone = e.detail.value.phone;
    var remark = e.detail.value.remark;

    //校验手机号
    if(that.checkPhone(phone) != ""){
      wx.showModal({
        title: '错误',
        content: '手机号填写有误',
        showCancel: false
      })
        return ;
    }

    var postData = {
      money: -amount,
      mobile : phone,
      remark: remark,
      x_token: wx.getStorageSync('x_token'),
      uid: ''
    }
    BACKENDAPI.deductFAsset(postData).then(function(res){
      if(res.code == 0){
        wx.showModal({
          title: '成功',
          content: '成功扣除',
          showCancel: false,
          success: function(){
            wx.navigateBack();
          }
        })
      }else{
        wx.showModal({
          title: '扣除失败',
          content: '1.请确认该会员绑定了手机号；2.者输入手机号是否正确; 具体原因：'+res.msg,
          showCancel: false
        })
      }
    });
  
  },

  /**
   * 页面的初始数据
   */
  data: {

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