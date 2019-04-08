//app.js


App({
  onLaunch: function (options) {
  },
  globalData: {
    userInfo: null
  },

  onShow(options) {
    if (options.scene === 1089) {
     wx.navigateTo({ // eslint-disable-line
        url: '/pages/index/index',
      });
    }
  },
})