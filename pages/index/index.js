//index.js
//获取应用实例
let shareValue = {};

Page({
  onShareAppMessage: function (res) {
    return {
      title: shareValue.title,
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
    if (path.indexOf('orgCommodity') !== -1) {
      wx.setNavigationBarTitle({
        title: '海棠周边',
      });
    }
    this.setData({ Url: `https://hi.amzport.com/app/wechat.html#/${sharePath}` });
  },
})
