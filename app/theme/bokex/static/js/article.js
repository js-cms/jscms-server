(function ($) {
  $(document).ready(function () {
    // 初始化文章评论组件
    jscmssdk.loaded(function () {
      let comment = this.comment.render({
        selector: '#respond'
      });
    });
  });
})(jQuery);