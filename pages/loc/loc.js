Page({
  
  onLoad(option) {
    setTimeout(() => {
      wx.navigateBack();
    }, 500);
    wx.openLocation({
      latitude: parseFloat(option.lat),
      longitude: parseFloat(option.lng),
      name: option.name,
      scale: 18
    });
  },
})
