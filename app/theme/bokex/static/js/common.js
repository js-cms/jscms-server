(function ($) {
  'use strict';
  //绑定事件
  function bindEvent() {
    // 点赞事件
    $('.btn-like').on('click', function (e) {
      if ($(this).hasClass('liked')) return;
      var that = this;
      $.post('/api/front/article/like', {
        numberId: this.dataset.numberId
      }, function (res) {
        if (res.code === 0) {
          $(that).addClass('liked');
          $(that).find('#likeTotal').text(res.data.count);
        } else {
          alert(res.msg);
        }
      });
    });

    // 查看微信公众号二维码
    $('.btn-show-wxpub').on('click', function (e) {
      var user = __JSCMS_CONSTANT__.article.user;
      var options = {
        title: '扫一扫关注我的微信公众号',
        images: [{
          url: user.qrWx,
          desc: '',
        }]
      };
      jscmssdk.dialog.qrcode.show(options);
    });

    // 查看收款二维码
    $('.btn-show-reward').on('click', function (e) {
      var user = __JSCMS_CONSTANT__.article.user;
      var options = {
        title: '打赏作者。好文章，需要你的鼓励。',
        images: [{
          url: user.qrWxpay,
          desc: '微信扫一扫打赏',
        }, {
          url: user.qrAlipay,
          desc: '支付宝扫一扫打赏',
        }, {
          url: user.qrUnionpay,
          desc: '云闪付扫一扫打赏',
        }]
      };
      jscmssdk.dialog.qrcode.show(options);
    });
  }

  // 初始化dom
  function initDom() {
    // 处理移动端导航
    $('#primary-menu').slicknav({
      prependTo: '#slick-mobile-menu',
      allowParentLinks: true,
      label: '导航'
    });

    // 让右边栏固定
    $(window).load(function () {
      if (document.querySelector('#secondary')) {
        var stickySidebar = new StickySidebar('#secondary', {
          topSpacing: 20,
          bottomSpacing: 20,
          containerSelector: '.site_container',
          innerWrapperSelector: '.sidebar__inner'
        });
      }
    });
  }

  $(document).ready(function () {
    // 初始化jscmssdk
    window.jscmssdk = new JscmsSdk();
    window.jscmssdk.init();
    // 初始化dom
    initDom();
    // 绑定事件
    bindEvent();
  });
})(jQuery);