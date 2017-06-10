/**
 * P.js
 *
 * A simple Promises implementation
 *
 * Created by ice on 2017/6/10 上午9:00.
 */

function P (fn) {
  var state = 'pending',
    value = null,
    callbacks = [];

  /**
   * then() 方法返回一个  Promise 它最多需要有两个参数：Promise的成功和失败情况的回调函数。
   *
   * @param onResolved 已完成回调函数
   * @param onRejected 已失败回调函数
   * @return {Promise}
   */
  this.then = function (onResolved, onRejected) {
    return new P(function (resolve, reject) {
      if (state === 'pending') {
        callbacks.push([onResolved, resolve, onRejected, reject]);
        return;
      }

      if (state === 'fulfilled') {
        if (onResolved) {
          var ret = onResolved(value);
          resolve(ret);
        } else {
          resolve(value);
        }
      } else {
        if (onRejected) {
          onRejected(value);
        } else {
          reject(value);
        }
      }
    });
  };

  /**
   * catch() 方法返回一个Promise，只处理拒绝的情况。
   * 它的行为与调用 then(undefined, onRejected) 相同。
   *
   * @param onRejected
   * @return {Promise}
   */
  this.catch = function (onRejected) {
    return this.then(null, onRejected);
  };

  /**
   * resolve 可以在外部操作成功时调用，也可能会在 Promise 实现的内部被调用
   *
   * @param newValue 操作成功返回的结果，方便 onResolved 回调函数使用
   */
  function resolve (newValue) {
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      var then = newValue.then;
      if (typeof then === 'function') {
        then(resolve, reject);
        return;
      }
    }
    state = 'fulfilled';
    value = newValue;
    setTimeout(function () {
      callbacks.forEach(function (handler) {
        var onResolved = handler[0];
        var resolve = handler[1];
        if (onResolved) {
          var ret = onResolved(value);
          resolve(ret);
        } else {
          resolve(value);
        }
      });
    }, 0);
  }

  /**
   * reject 可以在外部操作失败时调用，也可能会在 Promise 实现的内部被调用
   *
   * @param reason 操作成功返回的结果，方便 onRejected 回调函数使用
   */
  function reject (reason) {
    value = reason;
    state = 'rejected';
    setTimeout(function () {
      callbacks.forEach(function (handler) {
        var onRejected = handler[2];
        var reject = handler[3];
        if (onRejected) {
          onRejected(value);
        } else {
          reject(value);
        }
      });
    }, 0);
  }

  fn(resolve, reject);
}

if (typeof module !== 'undefined' && typeof exports === 'object') {
  module.exports = P;
} else {
  window.P = P;
}