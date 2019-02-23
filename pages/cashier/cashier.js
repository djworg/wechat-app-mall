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
      wx.hideLoading();
      that.onShow();
    });
  },

/**
 * 获得微信应该支付多少钱，
 * 订单金额 - 账户余额 = 微信应付
 */
  getWxNeedPay:function(amount){
    var wxNeedPay;
    var loginToken = wx.getStorageSync('token'); // 用户登录 token
    var balance = wx.getStorageSync('balance');
   
    var temp = amount - balance;
    if (temp > 0) {
    //余额不足
      wxNeedPay = temp.toFixed(2);
    } else {
      //余额充足
      wxNeedPay = 0;
    }
    return wxNeedPay;
  },
  /**
      * 支付
      */
  comboPay:function (orderId, amount) {

    var that = this;
    var wxNeedPay = that.getWxNeedPay(amount);
    if (wxNeedPay + '1' == '1' || undefined == wxNeedPay) {
      wx.showModal({
        title: '错误',
        content: '无法获取用户资金信息',
        showCancel: false
      });
      wx.hideLoading();
      return;
    }
    console.log(wxNeedPay+"---"+amount);
    if(wxNeedPay > 0){
      
      //先充值，再支付
      wxpay.wxpay(app, wxNeedPay, orderId, "");
    }
    //使用余额支付
    that.balancePay(orderId, amount);
   
    
    
    //TODO 重定向支付成功页面

  },
  /**
 * 使用余额支付，先创建订单   
 */
  createOrderAndPay: function (goodsId, amount, staff) {
    wx.showLoading();
    var that = this;
    var loginToken = wx.getStorageSync('token'); // 用户登录 token
    var num = parseInt(amount * 10);
    var wxNeedPay = that.getWxNeedPay(amount);
    console.log(wxNeedPay+"---"+amount);
    if (wxNeedPay + '1' == '1' || undefined == wxNeedPay) {
      wx.showModal({
        title: '错误',
        content: '无法获取用户资金信息',
        showCancel: false
      });
      wx.hideLoading();
      return;
    }
    var remark = "发型师工号为："+staff+"，微信支付："+wxNeedPay+"，余额支付："+(amount-wxNeedPay);
    console.log(remark); // 备注信息
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

       that.comboPay(res.data.id, amount);
      });
      
  },
  confirmPay: function (e) {
    console.log(e)
    var that = this;
    var amount = e.detail.value.amount;
    var staff = e.detail.value.staff;
    var type = e.detail.value.type;
    if (amount == "" || amount * 1 < 0) {
      wx.showModal({
        title: '错误',
        content: '请填写正确金额',
        showCancel: false
      })
      return
    }
    if(amount < 1 && CONFIG.mode != 'dev'){
      wx.showModal({
        title: '错误',
        content: '输入金额不能小于1元',
        showCancel: false
      })
      return
    }
    if (staff == "" || staff + '1' == '1' || undefined == staff) {
      wx.showModal({
        title: '错误',
        content: '请选择发型师',
        showCancel: false
      })
      return
    }
    switch(type){
      case 'pay':{
        // 微信支付
        var goodsId = that.getGoodsId(staff);
        that.createOrderAndPay(goodsId, amount, staff);
      };
      break;
      case 'recharge':{
        // 充值
        
        wxpay.wxpay(app, amount, 0, "/pages/cashier/index");
      };
      break;
    }
    
  },
  getGoodsId:function(staff){
    var goodsId;
    if(staff == '01'){
      goodsId = '117861';
    }else {
      goodsId = '118867';
    }
    return goodsId;
  },
  
  /**
   * 获得用户余额
   */
  getUserAmount: function () {
    var that = this;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function (res) {
      if (res.code == 0) {
        wx.setStorageSync('balance', res.data.balance);
        that.setData({
          balance: res.data.balance.toFixed(2),
          freeze: res.data.freeze.toFixed(2),
          score: res.data.score
        });
      } else {
        wx.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false
        });
      }
    })
  },
/**
 * 获得充值活动
 */
  getRechargeRule(){
    var that = this;
    // 获取充值活动优惠
    WXAPI.rechargeRule().then(function(res){
        if(res.code == 0){
          console.log(res.data);
          var arr = res.data;
          that.setData({
            rechargeDic: arr,
            confine:arr[0].confine,
            send:arr[0].send
          });
        
        }else{
          wx.showModal({
            title: '错误',
            content: '无法获得充值优惠',
            showCancel: false
          });
        }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    uid: wx.getStorageSync('uid');
    wx.setNavigationBarTitle({
      title: "付款"
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
    this.getUserAmount();
    this.getRechargeRule();
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