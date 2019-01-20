// components/calendar/calendar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    curYear: {
      type: Number,
      value: (new Date()).getFullYear()
    },
    curMonth: {
      type: Number,
      value: (new Date()).getMonth() + 1
    },
    curDay: {
      type: Number,
      value: (new Date()).getDate()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selectedDate: "",
    selectedWeek: "",
    monthOfDay: [
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
    ],
    week: [
      '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'
    ],
    dateList: []

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /** 上一个月 */
    preMonth: function() {
      let _this = this;
      let curYear = _this.data.curYear;
      let curMonth = _this.data.curMonth;
      curYear = curMonth - 1 > 0 ? curYear : curYear - 1;
      curMonth = curMonth - 1 > 0 ? curMonth - 1 : 12;
      console.log(curYear + "-" + curMonth);
      _this.setData({
        curYear: curYear,
        curMonth: curMonth
      });
      _this.refreshDateList(curYear, curMonth - 1);
    },
    
    /** 下一个月 */
    nextMonth: function() {
      let _this = this;
      let curYear = _this.data.curYear;
      let curMonth = _this.data.curMonth;
      curYear = curMonth == 12 ? curYear + 1 : curYear;
      curMonth = curMonth == 12 ? 1 : curMonth + 1;
      _this.setData({
        curYear: curYear,
        curMonth: curMonth
      });
      _this.refreshDateList(curYear, curMonth - 1);
    },

    /** 刷新日期列表 */
    refreshDateList: function(year, month) {
      let _this = this;

      // 判断闰年
      let monthOfDay = _this.data.monthOfDay;
      if (year % 4 == 0 && year % 100 != 0) {
          monthOfDay[1] = 29;
          _this.setData({
            monthOfDay: monthOfDay
          });
      }

      //第几个月；下标从0开始实际月份还要再+1  
      var dateList = [];
      dateList[0] = [];
      var weekIndex = 0;//第几个星期
      for (var i = 0; i < _this.data.monthOfDay[month]; i++) {
        var week = new Date(year, month, (i + 1)).getDay();
        // 如果是新的一周，则新增一周
        if (week == 0) {
          weekIndex++;
          dateList[weekIndex] = [];
        }
        // 如果是第一行，则将该行日期倒序，以便配合样式居右显示
        if (weekIndex == 0) {
          dateList[weekIndex].unshift({
            value: year + '-' + (month + 1) + '-' + (i + 1),
            date: i + 1,
            week: week
          });
        } else {
          dateList[weekIndex].push({
            value: year + '-' + (month + 1) + '-' + (i + 1),
            date: i + 1,
            week: week
          });
        }
      }
      _this.setData({
        dateList: dateList
      });
    },

    /**
     * 选中日期事件
     */
    selectDate: function(e) {
      let _this = this;
      _this.setData({
        selectedDate: e.currentTarget.dataset.date.value
        // selectedWeek: _this.data.week[e.currentTarget.dataset.date.week]
      });
    },

    /**
     * 初始化选中的日期
     */
    initSelectDate: function() {
      let _this = this;
      let date = _this.data.curYear + "-" + _this.data.curMonth + "-" + _this.data.curDay;
      _this.setData({
        selectedDate: date
      });
    }

  },

  pageLifetimes: {
    show() {
      let _this = this;
      _this.refreshDateList(_this.data.curYear, _this.data.curMonth - 1);
      _this.initSelectDate();
    }
  }

})
