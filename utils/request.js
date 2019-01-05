const REQUEST_CACHE = []
const API_BASE_URL = 'https://fastflow.com'
const SUB_DOMAIN = 'abc'

/**
 * 简单请求封装
 * url: 请求地址
 * data: 请求内容
 * method: 请求方法
 * cache: 缓存时长(单位: 秒)
 */
function doGet(url, data, method = 'GET', cache = 0, header = {}, noSubDomain = false) {
  var request_key = getStorageKey(url, method);
  if (cache) {
    return new Promise(storage);
  } else {
    return new Promise(request);
  }

  /**
   * 缓存相关
   */
  function storage(resolve, reject) {
    wx.getStorage({
      key: request_key,
      success: storageSuccess,
      fail: storageError
    })

    /**
     * 成功回调
     */
    function storageSuccess(store) {
      if (checkCache(store.data)) {
        resolve(store.data);
      } else {
        request(resolve, reject);
      }
    }

    /**
     * 异常处理
     */
    function storageError(err) {
      request(resolve, reject);
    }
  }

  /**
   * 请求接口
   */
  function request(resolve, reject) {
    if (checkRequest(request_key)) {
      return;
    }
    saveRequest(request_key);
    let _url = API_BASE_URL + '/' + SUB_DOMAIN + url
    if (noSubDomain) {
      _url = API_BASE_URL + url
    }
    wx.request({
      url: _url,
      method: method.toUpperCase(),
      data: data,
      header: header,
      success: fetchSuccess,
      fail: fetchError,
      complete: fequestOver
    })

    /**
     * 成功回调
     */
    function fetchSuccess(res) {
      saveCache(res);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(res);
      } else {
        fetchError(res.data);
        switch (res.statusCode) {
          case 403:
            // 业务逻辑处理
            break
        }
      }
    }

    /**
     * 异常处理
     */
    function fetchError(err) {
      if (err) {
        wx.showToast({
          title: err.errMsg || err.message,
          icon: 'none',
          duration: 3000
        })
      }
      reject(err);
    }
  }

  /**
   * 保存缓存信息
   */
  function saveCache(res) {
    if (cache > 0 && res.statusCode >= 200 && res.statusCode < 300) {
      res.timestamp = Date.parse(new Date()) + cache * 1000;
      wx.setStorage({
        key: getStorageKey(url, method),
        data: res,
      })
    }
  }

  /**
   * 验证缓存是否过期
   */
  function checkCache(data) {
    return data.timestamp < Date.parse(new Date());
  }

  function requestOver() {
    removeRequest(request_key);
  }
}

/**
 * 并发请求
 * 没做缓存等处理
 */
function fetchRequestAll(data) {
  return new Promise(function (resolve, reject) {
    Promise.all(data).then(res => {
      resolve(res)
    })
  })
}

function checkRequest(key) {
  return REQUEST_CACHE.indexOf(key) >= 0;
}

function saveRequest(key) {
  var index = REQUEST_CACHE.indexOf(key);
  if (index <= 0) {
    REQUEST_CACHE.push(key);
  }
}

function removeRequest(key) {
  var index = REQUEST_CACHE.indexOf(key);
  if (index >= 0) {
    REQUEST_CACHE.splice(index, 1);
  }
}

function getStorageKey(url, method) {
  return `${method.toUpperCase()}:${url.toUpperCase()}`
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
  doGet: doGet,
  cacheTime: 1800,
  fetchRequestAll: fetchRequestAll
}