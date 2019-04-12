//app.js
let sceneOpen = 0;

App({
  onLaunch: function (options) {
  },
  globalData: {
    userInfo: null
  },

  onShow(options) {
    if (options.scene === 1089 && sceneOpen !== options.scene) {
      wx.redirectTo({ // eslint-disable-line
        url: '/pages/index/index',
      });
    }
    sceneOpen = options.scene;
  },
})