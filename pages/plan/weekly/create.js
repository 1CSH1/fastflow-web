// pages/plan/weekly/create.js

const WXAPI = require('../../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    aim: ''
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

  },

  /**
   * TextArea 失去焦点事件
   */
  bindInputEvent: function(e) {
    console.log(e);
    this.setData({
      aim: e.detail.value,
    })
  },

  /**
   * 取消按钮点击事件
   */
  handleCancelTap(e) {
    wx.navigateBack()
  },

  /**
   * 保存按钮点击事件
   */
  handleSaveTap(e) {

    let data = {
      'aim': this.data.aim
    }

    WXAPI.addWeeklyGoal(data).then(function (res) {
      if (res.code != 200) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      } else {
        wx.showToast({ title: '添加成功' });
        wx.navigateBack();
      }
    })
    
  },
})