let storyId = 0;

Page({
  onLoad: function (query) {
    let path = query.p || query.s || '';
    if (query.scene) {
      const scene = decodeURIComponent(query.scene);
      path = scene;
    }
    let om = 'p';
    if (query.scene || query.s) {
      om = 's';
    }
    if (path.indexOf('story') !== -1) {
      this.setData({ storyUrl: `https://hi.amzport.com/story/${path.split('story-')[1]}/?om=${om}` });
      storyId = path.split('story-')[1];
    } else if (query.p && !query.scene) {
      wx.navigateBack();
    } else {
      wx.redirectTo({ // eslint-disable-line
        url: `/pages/index/index?p=${path}`,
      });
    }
  },

  onShareAppMessage: function (res) {
    return {
      title: '海棠简测',
      path: `pages/story/story?s=story-${storyId}`,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
