//余额扣除 pages/admin/k-asset/index.js

const BACKENDAPI = require('../../../wxapi/backend')
Page({


  checkPhone: function(mobile){
    if(mobile.length != 11) {
    
      return "手机号长度有误";
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
   
    var phoneTip = that.checkPhone(phone);
    //校验手机号
    if ("" != phoneTip){
      wx.showModal({
        title: '错误',
        content: phoneTip,
        showCancel: false
      })
        return ;
    }

    if (amount == "") {
      wx.showModal({
        title: '错误',
        content: '请填写正确金额',
        showCancel: false
      })
      return
    }

    if(remark == ""){
      wx.showModal({
        title: '错误',
        content: '请输入备注信息,以备后续查账',
        showCancel: false
      });
      return;
    }
    var postData = {
      money: -amount,
      mobile: phone,
      remark: remark,
      x_token: wx.getStorageSync('x_token'),
      uid: ''
    }

    wx.showModal({
      title: '提示',
      content: '是否从账户'+phone+'，扣除'+amount+'元',
      showCancel: true,//是否显示取消按钮
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          return;
        } else {
          that.netDeductFAsset(postData);
        }
      }
    });
    
  
  },

  netDeductFAsset: function (postData){
    BACKENDAPI.deductFAsset(postData).then(function (res) {
      if (res.code == 0) {
        wx.showModal({
          title: '成功',
          content: '成功扣除',
          showCancel: false,
          success: function () {
            wx.navigateTo({
              url: '/pages/admin/member-asset/index?mobile=' + postData.mobile,
            })
          }
        })
      } else {
        var msg = res.msg;
        if(res.code == 300){
          msg = "余额不足";
        }
        wx.showModal({
          title: '扣除失败',
          content: '1.请确认该会员绑定了手机号；2.者输入手机号是否正确; 具体原因：' + msg,
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