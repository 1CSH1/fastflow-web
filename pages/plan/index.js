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
      
      let jsonData = JSON.parse(res.data);
      console.log(jsonData);

      for (let i = 0; i < jsonData.length; i++){
        let weeklyGoal = jsonData[i];
        if (weeklyGoal.state != 2) {
          weeklyGoals = weeklyGoals.concat([
            new WeeklyGoal({
              id: weeklyGoal.id,
              weekId: weeklyGoal.weekId,
              aim: weeklyGoal.aim,
              summary: weeklyGoal.summary,
              state: weeklyGoal.state,
              uid: weeklyGoal.uid,
              create_time: weeklyGoal.create_time
            })
          ])
        }
      } 
      console.log(weeklyGoals)
      _this.setData({
        thisWeekGoalTitle: "本周 " + weeklyGoals.length + " 目标",
        thisWeekGoalList: weeklyGoals
      })

    });

    // TODO 获取本日任务
    _this.setData({
      thisDayTaskTitle: "本日无任务",
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

  /**
     * Weekly 长按事件
     */
  weeklyLongTap(e) {
    let _this = this;
    let id = e.currentTarget.dataset.id;
    let data = {
      'id': id
    }

    wx.showModal({
      title: '提示',
      content: '确定要删除该目标么？',
      success: (e) => {
        
        if (e.confirm) {
          // _this.data.thisWeekGoalList.splice(index, 1)
          WXAPI.deleteWeeklyGoal(data).then(function (res){
            if (res.code != 200) {
              wx.showModal({
                title: '错误',
                content: res.msg,
                showCancel: false
              })
              return;
            } else {
              wx.showToast({ title: '删除成功' });
              _this.onShow();
            }
          })

        }
      }
    })
  },
})