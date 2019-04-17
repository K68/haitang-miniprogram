let logPath = '';

Page({
  data: {
    Title: '', //学堂名称
    Src: '', //学堂
    CodeSrc: '', //小程序码
    BackSrc: '', //小程序背景
    OrgScan: false, //是否自定义二维码
    left: 100, // 二维码左偏移量
    top: 100, // 二维码上便宜量
    scanWidth: 180, // 二维码大小
    ImgLoad: true,
    CanvasWidth: 0,
    CanvasHeight: 0,
  },
  promisify: api => {
    return (options, ...params) => {
      return new Promise((resolve, reject) => {
        const extras = {
          success: resolve,
          fail: reject
        }
        api({ ...options, ...extras }, ...params)
      })
    }
  },
  
  onLoad(option) {
    this.setData({
      Title: decodeURIComponent(option.title),
      top: parseInt(option.top || 0, 10),
      left: parseInt(option.left || 0, 10),
      scanWidth: parseInt(option.scanWidth || 150, 10),
      Src: decodeURIComponent(option.src || ''),
      CodeSrc: decodeURIComponent(option.codeSrc || ''),
      BackSrc: decodeURIComponent(option.backSrc || ''),
      OrgScan: option.orgScan === 'true',
    });
    logPath = option.path;
  },
  
  openImg: function () {
    if (this.data.OrgScan) {
      const wxGetImageInfo = this.promisify(wx.getImageInfo);
      Promise.all([
        wxGetImageInfo({
          src: this.data.BackSrc + '-1000.1000',
        }),
        wxGetImageInfo({
          src: this.data.CodeSrc,
        }),
        wxGetImageInfo({
          src: this.data.Src,
        })
      ]).then(res => {
        this.setData({
          ImgLoad: false,
          CanvasWidth: res[0].width,
          CanvasHeight: res[0].height,
        });
        const ctx = wx.createCanvasContext('shareCanvas');
        ctx.drawImage(res[0].path, 0, 0, res[0].width, res[0].height);
        const qrImgSize = this.data.scanWidth;
        ctx.drawImage(res[1].path, this.data.left, this.data.top, qrImgSize, qrImgSize);
        const qrCircleSize = (84 / 180) * qrImgSize;
        ctx.arc(this.data.left + qrImgSize / 2, this.data.top + qrImgSize / 2, qrCircleSize / 2 - 2, 0, Math.PI * 2);
        ctx.save();
        ctx.clip();
        ctx.drawImage(res[2].path, this.data.left + qrImgSize / 3.75, this.data.top + qrImgSize / 4, qrCircleSize, qrCircleSize);
        ctx.restore();
        ctx.draw();
      })
    } else {
      const wxGetImageInfo = this.promisify(wx.getImageInfo);
      Promise.all([
        wxGetImageInfo({
          src: this.data.CodeSrc,
        }),
        wxGetImageInfo({
          src: this.data.Src,
        })
      ]).then(res => {
          this.setData({
            ImgLoad: false,
            CanvasWidth: res[0].width,
            CanvasHeight: res[0].height + 80,
          });
        const ctx = wx.createCanvasContext('shareCanvas');
          ctx.setFillStyle('#212121')
          ctx.setFontSize(18);
          ctx.fillText(this.data.Title, 16, 32);
          ctx.setFillStyle('#757575')
          ctx.setFontSize(16);
          ctx.fillText('\u957f\u6309\u0020\u6216\u0020\u626b\u63cf\u8bc6\u522b\u56fe\u4e2d\u4e8c\u7ef4\u7801', 36, res[0].height + 64);

          ctx.drawImage(res[0].path, 0, 40, res[0].width, res[0].height);
          const qrImgSize = res[0].width;
          const qrCircleSize = (84 / 180) * qrImgSize;
        ctx.save();
        ctx.beginPath();
        ctx.setFillStyle('white')
        ctx.arc(qrImgSize / 2, qrImgSize / 2 + 40, qrCircleSize / 2 - 2, 0, Math.PI * 2);
        
        ctx.closePath();
        ctx.fill();
        ctx.clip();
        ctx.drawImage(res[1].path, qrImgSize / 3.75, qrImgSize / 4 + 40, qrCircleSize, qrCircleSize);
        ctx.restore();
          ctx.draw();
        })
    }
  },

  saveImg: function () {
    if (!this.data.ImgLoad) {
      var that = this;
      setTimeout(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: that.data.CanvasWidth,
          height: that.data.CanvasHeight,
          destWidth: that.data.CanvasWidth,
          destHeight: that.data.CanvasHeight,
          canvasId: 'shareCanvas',
          success: function (res) {
            that.setData({
              savedImgUrl: res.tempFilePath,
            })
          }
        })
      }, 1000)
      setTimeout(function () {
        if (that.data.savedImgUrl != "") {
          wx.saveImageToPhotosAlbum({
            filePath: that.data.savedImgUrl,
            success: function () {
              wx.showModal({
                title: '保存图片成功',
                content: '图片已经保存到相册，快去炫耀吧！',
                showCancel: false,
                success: function (res) {
                  that.setData({
                    canvasShow: false,
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              });
            },
            fail: function (res) {
              console.log(res);
              if (res.errMsg == "saveImageToPhotosAlbum:fail cancel") {
                wx.showModal({
                  title: '保存图片失败',
                  content: '您已取消保存图片到相册！',
                  showCancel: false
                });
              } else {
                wx.showModal({
                  title: '提示',
                  content: '保存图片失败，您可以点击确定设置获取相册权限后再尝试保存！',
                  complete: function (res) {
                    console.log(res);
                    if (res.confirm) {
                      wx.openSetting({}) //打开小程序设置页面，可以设置权限
                    } else {
                      wx.showModal({
                        title: '保存图片失败',
                        content: '您已取消保存图片到相册！',
                        showCancel: false
                      });
                    }
                  }
                });
              }
            }
          })
        }
      }, 1500)
    }
  },
  
  onHide() { 
  
  },
  bindKeyInput(e) {
    this.setData({
      Title: e.detail.value
    })
  },
  onShareAppMessage: function (res) {
    wx.navigateBack({ delta: 1 });

    if (res.from === 'button') {
      console.log('from button');  
    }

    return {
      title: this.data.Title,
      imageUrl: this.data.Src,
      path: `pages/index/index?p=${logPath}`,
    }
  },
  touchShare: function() {
    setTimeout(() => {
        wx.navigateBack({ delta: 1 });
    }, 10);
  },
  touchStart: function() {
    wx.hideKeyboard();
  },
})
