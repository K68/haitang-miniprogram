Page({
  data: {

  },
  onLoad: function () {
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log('from button');  
    }

    return {
      title: '666',
      path: 'pages/index/index'
    }
  },
  touchShare: function() {
    wx.navigateBack({ delta: 1 });
  },
  touchStart: function() {
    wx.hideKeyboard();
  },
})
