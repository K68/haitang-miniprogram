Page({
  
  onLoad(option) {
    wx.navigateBack();
    wx.openLocation({
      latitude: parseFloat(option.lat),
      longitude: parseFloat(option.lng),
      name: option.name,
      scale: 18
    });
  },
})
