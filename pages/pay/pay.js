Page({

  data: {
    Title: '', //商品名称
    Money: '', //支付金额
    detail: '', //商品详情
    attach: '', //店铺信息
    openid: '',
    adid: null,
    token: '',
  },

    onLoad(option) {
      const that = this;
      this.setData({
        Title: decodeURIComponent(option.title),
        Money: parseFloat(option.money),
        detail: decodeURIComponent(option.detail || ''),
        attach: decodeURIComponent(option.attach || ''),
        adid: option.adid || null,
        scid: option.scid || null,
        token: option.token || '',
      });
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
                const openid = session.header['openid'];
                that.setData({
                  openid,
                });
                that.toPay();
              }
            })
          }
        }
      });
    },

  toPay() {
    const that = this;
    if (that.data.openid) {
      wx.request({
        url: 'https://hi.amzport.com/api/weChat/weChatPayUnifiedorder',
        method: 'POST',
        data: {
          body: '海棠体验课-' + that.data.Title,
          openid: that.data.openid,
          detail: that.data.detail,
          attach: that.data.attach,
          adid: parseInt(that.data.adid,10),
          spbillCreateIp: '39.188.212.16',
        },
        header: {
          'content-type': 'application/json',
          'X-Auth-Token': that.data.token,
        },
        success: function (info) {
          const pay = info.data.data;
          wx.requestPayment({
            timeStamp: pay.timeStamp + '',
            nonceStr: pay.nonceStr,
            package: pay.package,
            signType: 'MD5',
            paySign: pay.paySign,
            success(res) {
              wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 2000,
              });
              wx.navigateBack();
            },
            fail(res) { 
              console.log(res);
            }
          })
        }
      })
    } else {
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
                const openid = session.header['openid'];
                that.setData({
                  openid,
                });
              }
            })
          }
        }
      });
    }
  }
})
