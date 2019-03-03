// pages/plan/weekly/modify.js

const WXAPI = require('../../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    aim: '',
    summary: '',
    state: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let id = options.id;
    let aim = options.aim;
    let summary = options.summary;
    let state = options.state;
    _this.setData({
      id: id,
      state: state,
      aim: aim,
      summary: summary
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

  },

  /**
   * 状态变更
   */
  radioChange: function(e) {
    this.setData({
      state: e.detail.value
    })
  },

  /**
   * 修改日任务
   */
  bindAimInputEvent: function(e) {
    this.setData({
      aim: e.detail.value
    })
  },

  /**
   * 修改日总结
   */
  bindSummaryInputEvent: function (e) {
    this.setData({
      summary: e.detail.value,
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
      'id': this.data.id,
      'state': this.data.state,
      'aim': this.data.aim,
      'summary': this.data.summary
    }

    WXAPI.updateDailyTask(data).then(function (res) {
      if (res.code != 200) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return;
      } else {
        wx.showToast({ 
          title: '修改成功',
          duration: 2000,
          success: () => {
            setTimeout(function () {
              wx.navigateBack()
            }, 2000);     
          }
        });
      }
    })

  },
})