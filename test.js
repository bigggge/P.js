/**
 * test.js
 *
 * Created by ice on 2017/6/10 上午9:01.
 */

var P = require('./P.js');

function getUserId () {
  return new P(function (resolve, reject) {
    setTimeout(function () {
      Math.random() > 0.3 ? resolve(9876) : reject('error1');
    });
  });
}

function getUserMobileById (id) {
  return new P(function (resolve, reject) {
    console.log('start to get user mobile by id:', id);
    setTimeout(function () {
      Math.random() > 0.3 ? resolve(id + ':' + 13810001000) : reject('error2');
    });
  });
}

getUserId()
  .then(getUserMobileById)
  .then(function (mobile) {
    console.log('do sth with', mobile);
  })
  .catch(function (reason) {
    console.error(reason);
  });