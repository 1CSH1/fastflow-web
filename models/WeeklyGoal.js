import util from '../utils/date'

/**
 * WeeklyGoal 模型类
 */
class WeeklyGoal {
  constructor() {
    Object.assign(this, {
      id: 0,
      weekId: 20190101,
      content: '',
      summary: '',
      state: 0,
      uid: 0,
      create_time: new Date()
    })

    // 日期格式化
    if (this.create_time.constructor === Date) {
      this.create_time = util.formatTime(this.create_time)
    }
  }
}

export default WeeklyGoal
