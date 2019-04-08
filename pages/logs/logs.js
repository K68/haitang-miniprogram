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
  onHide() { 
  
  },
  bindKeyInput(e) {
    this.setData({
      Title: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    wx.navigateBack({ delta: 1 });

    if (res.from === 'button') {
      console.log('from button');  
    }

    return {
      title: this.data.Title,
      path: `pages/index/index?p=${logPath}`,
    }
  },
  touchStart: function() {
    wx.hideKeyboard();
  },
})
