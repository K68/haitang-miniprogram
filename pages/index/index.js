//index.js
//获取应用实例
let shareValue = {};

Page({
  onShareAppMessage: function (res) {
    return {
      title: shareValue.title,
      imageUrl: shareValue.imageUrl,
      path: `pages/index/index?p=${shareValue.path}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  viewmessageFn: function(e) {
    if (e.type === 'message' && e.detail && e.detail.data && e.detail.data.length > 0) {
      shareValue = e.detail.data[e.detail.data.length - 1];
    }
  },

  onLoad: function (query) {
    let path = query.p || '';
    if (query.scene) {
      path = decodeURIComponent(query.scene);
    }
    const sharePath = path.replace(/-/g, '/'); 
    this.setData({ Url: `https://hi.amzport.com/app/wechat.html#/${sharePath}?wechat=haitang` });

    setTimeout(function() {
      wx.navigateTo({ url: '/pages/logs/logs' });
    }, 3500);
  },
})
