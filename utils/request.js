const API_BASE_URL = 'http://localhost:8000'
const SUB_DOMAIN = 'abc'

const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + SUB_DOMAIN : '') + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  queryWeeklyGoal: (data) => {
    return request("/queryWeeklyGoal", false, 'get', data)
  },
  addWeeklyGoal: (data) => {
    return request("/addWeeklyGoal", false, 'get', data)
  },
  updateWeeklyGoal: (data) => {
    return request("/updateWeeklyGoal", false, 'get', data)
  },
  deleteWeeklyGoal: (data) => {
    return request("deleteWeeklyGoal", false, 'get', data)
  },
  login: (code) => {
    return request('/user/wxapp/login', true, 'post', {
      code,
      type: 2
    })
  },
  register: (data) => {
    return request('/user/wxapp/register/complex', true, 'post', data)
  }
}