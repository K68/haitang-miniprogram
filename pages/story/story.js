
Page({
  onLoad: function (query) {
    let path = query.p || '';
    if (query.scene) {
      const scene = decodeURIComponent(query.scene);
      path = scene;
    }
    if (path.indexOf('story') !== -1) {
      this.setData({ storyUrl: `https://hi.amzport.com/story/${path.split('story-')[1]}/` });
    } else if (query.p && !query.scene) {
      wx.navigateBack();
    } else {
      wx.redirectTo({ // eslint-disable-line
        url: `/pages/index/index?p=${path}`,
      });
    }
  },
})
