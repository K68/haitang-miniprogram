Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Status: true, // true.登录 false.注册 
    PeName: '',
    pePic: '',
    openid: '',
    wCode: '',
  },

  onLoad: function (query) {
    if (query.p) {
      this.setData({ wCode: query.p });
    } else {
      wx.navigateBack();
    }
  },

  getPhoneNumber(e) {
    const that = this;
    if (e.detail.iv) {
      wx.request({
        url: 'https://hi.amzport.com/api/weChat/getWchatLoginPhoneNumber',
        method: 'POST',
        data: {
          openid: that.data.openid,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (userInfo) {
          console.log(userInfo);
          const value = {
            path: '注册',
            phoneNumber: userInfo.data.data.phoneNumber,
            PeName: that.data.PeName,
            pePic: that.data.pePic,
          };
          console.log(value)
          wx.request({
            url: 'https://hi.amzport.com/api/weChat/setWCode',
            method: 'POST',
            data: {
              wCode: that.data.wCode,
              wValue: JSON.stringify(value),
            },
            header: {
              'content-type': 'application/json'
            },
            success: function () {}
          })
        }
      })
    } else {
      const value = {
        path: '注册',
        PeName: this.data.PeName,
        pePic: this.data.pePic,
      };
      wx.request({
        url: 'https://hi.amzport.com/api/weChat/setWCode',
        method: 'POST',
        data: {
          wCode: this.data.wCode,
          wValue: JSON.stringify(value),
        },
        header: {
          'content-type': 'application/json'
        },
        success: function () { }
      })
    }
    wx.navigateBack(); // 解码完成前往注册 PeName名称 pePic头像 + 手机号
  },

  toLogin () {
    const value = {
      path: '登录',
    };
    wx.request({
      url: 'https://hi.amzport.com/api/weChat/setWCode',
      method: 'POST',
      data: {
        wCode: this.data.wCode,
        wValue: JSON.stringify(value),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function () { }
    })
    wx.navigateBack(); // 前往登录
  },

  toRegister() {
    const value = {
      path: '注册',
      PeName: this.data.PeName,
      pePic: this.data.pePic,
    };
    wx.request({
      url: 'https://hi.amzport.com/api/weChat/setWCode',
      method: 'POST',
      data: {
        wCode: this.data.wCode,
        wValue: JSON.stringify(value),
      },
      header: {
        'content-type': 'application/json'
      },
      success: function () { }
    })
    wx.navigateBack(); // 前往注册 PeName名称 pePic头像
  },

  wxLogin() {
    const that = this;
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: 'https://hi.amzport.com/api/weChat/queryCode2Session', //接口名称
            method: 'POST',
            data: {
              code: res.code,
            },
            header: {
              'content-type': 'application/json'
            },
            success: function (session) {
              const status = session.data.data;
              const openid = session.header['openid'];
              if (status < 0) {
                  wx.showToast({
                    title: '接口错误请重试',
                    icon: 'none',
                    duration: 2000,
                  });
              } else if (status === 0) {
                  that.setData({
                    Status: false,
                  })
                  wx.getSetting({
                    success(info) {
                      if (info.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          withCredentials: true,
                          success: function (info) {
                            that.setData({
                              PeName: info.userInfo.nickName,
                              pePic: info.userInfo.avatarUrl,
                              openid,
                            })
                            wx.request({
                              url: 'https://hi.amzport.com/api/weChat/getWchatLoginInfo', //接口名称
                              method: 'POST',
                              data: {
                                openid,
                                encryptedData: info.encryptedData,
                                iv: info.iv,
                              },
                              header: {
                                'content-type': 'application/json'
                              },
                              success: function (userInfo) {
                                console.log(userInfo);
                              }
                            })
                          }
                        })
                      }
                    }
                  })
              } else if (status === 1) {
                // 微信登录成功
              } else {
                wx.showToast({
                  title: '接口错误请重试' + status,
                  icon: 'none',
                  duration: 2000,
                });
              }
            }
          });
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})
