let storyId = 0;

Page({
  data: {
    Code: '', //学堂名称
    Notice: '请输入优惠码进行校验',
    NoticeShow: 'none',
    SucessShow: '',
  },

  onLoad: function (query) {
    
  },


  bindKeyInput(e) {
    this.setData({
      Code: e.detail.value,
    })
  },

  touchApply() {
    if (!this.data.SucessShow) {
      return;
    }
    const that = this;
    wx.request({
      url: 'https://hi.amzport.com/api/ad/queryCgCode',
      method: 'POST', 
      data: {
        cgCode: this.data.Code,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let Notice = '';
        if (res.data.data) {
          const jsList = res.data.data;
          const cheap = jsList[1];
          const info = jsList[0][0];
          const newTime = new Date().getTime();
          const cgTime = new Date(cheap.adExtra.cgUserTime).getTime();
          const hourTime = 60 * 60 * 1000;
          if (cheap.adRank !== 2) {
            Notice = '无奖品';
          } else if (info.cgGrant) {
            Notice = '已领取奖品';
          } else if (!cheap.adExtra.cgUserTime) {
            Notice = '还没核销，请让商家配合操作';
          } else if ((cgTime + cheap.adExtra.gainDate * hourTime) < newTime) {
            Notice = `未到有效期，还剩余${parseInt((newTime - cgTime) / hourTime - cheap.gainDate.cgGainDate, 10)}小时`;
          }
        } else {
          Notice = '优惠券不存在';
        }
        that.setData({
          Notice,
          NoticeShow: Notice || 'none',
          SucessShow: Notice ? 'none' : '',
        })
      }
    })
  },
})
