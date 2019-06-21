Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    Status: true, // true.登录 false.注册 
    PeName: '',
    pePic: '',
    openid: '',
    wCode: '',
    peUnionid: '',
    regStep: 0,
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
          sCode: that.data.regStep,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (userInfo) {
          const token = userInfo.header['X-Auth-Token'];
          if (token) {
            let value = {};
            if (userInfo.data.code === 7 || userInfo.data.code === 13) {
              value = {
                path: '修改手机号',
                token,
              };
            } else {
              value = {
                path: '自动登录',
                token,
              };
            }
          } else {
            value = {
              path: '注册',
              phoneNumber: userInfo.data.data.phoneNumber,
              PeName: that.data.PeName,
              pePic: that.data.pePic,
              peUnionid: that.data.peUnionid,
            };
          }
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
          })
        }
      })
    } else {
      const value = {
        path: '注册',
        PeName: this.data.PeName,
        pePic: this.data.pePic,
        peUnionid: this.data.peUnionid,
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
      peUnionid: this.data.peUnionid,
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
              const token = session.header['X-Auth-Token'];
              that.setData({
                openid,
              })
              if (token) {
                const value = {
                  path: '自动登录',
                  token,
                };
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
                })
                wx.navigateBack();
              } else if (status < 0) {
                  wx.showToast({
                    title: '接口错误请重试',
                    icon: 'none',
                    duration: 2000,
                  });
              } else if (status === 0) {
                  wx.getSetting({
                    success(info) {
                      if (info.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          withCredentials: true,
                          success: function (info) {
                            that.setData({
                              PeName: info.userInfo.nickName,
                              pePic: info.userInfo.avatarUrl,
                            })
                            wx.request({
                              url: 'https://hi.amzport.com/api/weChat/getWchatLoginInfo', //解密微信用户信息
                              method: 'POST',
                              data: {
                                openid,
                                encryptedData: info.encryptedData,
                                iv: info.iv,
                                sCode: session.data.data,
                              },
                              header: {
                                'content-type': 'application/json'
                              },
                              success: function (userInfo) {
                                const token = userInfo.header['X-Auth-Token'];
                                if (token) {
                                  const value = {
                                    path: '自动登录',
                                    token,
                                  };
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
                                  })
                                  wx.navigateBack();
                                } else {
                                  that.setData({
                                    peUnionid: userInfo.data.data.unionid,
                                    regStep: userInfo.data.data.ssCode,
                                    Status: false,
                                  })
                                }
                              }
                            })
                          }
                        })
                      }
                    }
                  })
              } else if (status === 1 || status === 2) { // 获取手机号
                that.setData({
                  regStep: status,
                  Status: false,
                })
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
