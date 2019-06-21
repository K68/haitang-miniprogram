Page({

  data: {
    Title: '', //商品名称
    Money: '', //支付金额
  },

    onLoad(option) {
      this.setData({
        Title: decodeURIComponent(option.title),
        Money: parseFloat(option.money),
      });
    },
})
