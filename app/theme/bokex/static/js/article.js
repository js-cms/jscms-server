(function ($) {
  $(document).ready(function () {
    // 初始化文章评论组件
    let jscmssdk = window.jscmssdk;
    jscmssdk.comment.render({
      selector: '#respond'
    });
  });
})(jQuery); 