let logPath = '';

Page({
  data: {
    Title: '',
  },
  onLoad(option) {
    this.setData({
      Title: option.title,
    });
    logPath = option.path;
  },
  bindKeyInput(e) {
    this.setData({
      Title: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log('from button');  
    }

    return {
      title: this.data.Title,
      path: `pages/index/index?p=${logPath}`,
    }
  },
  touchShare: function() {
    wx.navigateBack({ delta: 1 });
  },
  touchStart: function() {
    wx.hideKeyboard();
  },
})
