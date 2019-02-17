// pages/plan/index.js
import WeeklyGoal from '../../models/WeeklyGoal.js'

const WXAPI = require('../../utils/request')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否显示日历
    displayCalendar: false,
    thisWeekGoalList: [],
    thisDayTaskList: [],
    selectedWeek: null,
    selectedDay: null,
    thisWeekGoalTitle: "本周无目标",
    thisDayTaskTitle: "今天没任务"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let curDate = new Date();
    let day;
    if (curDate.getDay() == 0) {
      day = curDate.getDate() - 6;
    } else {
      day = curDate.getDate() - curDate.getDay() + 1;
    }
    _this.setData({
      selectedDay: curDate,
      selectedWeek: new Date(curDate.getFullYear(), curDate.getMonth(), day)
    });
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
    let _this = this;
    
    //获取本周的目标，目标设置到 thisWeekGoalList
    WXAPI.queryWeeklyGoal().then(function(res) {
      if (res.code != 200) {
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
        return ;
      }
      if (res.data == null || res.data.length == 0) {
        _this.setData({
          thisWeekGoalTitle: "本周无目标"
        })
        return ;
      }

      let weeklyGoals = [];
      for (let i = 0; i < res.data.length; i++){
        let weeklyGoal = res.data[i];
        weeklyGoals = weeklyGoals.concat([
          new WeeklyGoal({
            id: weeklyGoal.id,
            weekId: weeklyGoal.weekId,
            content: weeklyGoal.content,
            summary: weeklyGoal.summary,
            state: weeklyGoal.state,
            uid: weeklyGoal.uid,
            create_time: weeklyGoal.create_time
          })
        ])
      } 
      
      
      _this.setData({
        thisWeekGoalList: res.data
      })
      console.log(res);
    });

    // TODO 获取本日任务
    _this.setData({
      thisDayTaskTitle: "本周无任务",
      thisDayTaskList: [
      ]
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

  },

  /**
   * 展示隐藏日期控件 
   */
  showCalendar: function () {
    var _this = this;
    _this.setData({
      displayCalendar: !_this.data.displayCalendar
    })
  },


})