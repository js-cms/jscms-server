(function ($) { //create closure so we can safely use $ as alias for jQuery
  $(document).ready(function () {
    "use strict";
    //评论系统
    var commentApp = new Vue({
      el: "#comments",
      data: function () {
        return {
          form: {
            articleId: window.articleId,
            authorNickname: "",
            authorUrl: "",
            authorEmail: "",
            mdContent: ""
          }
        }
      },
      mounted: function () {

      },
      methods: {
        checkForm: function () {
          if (this.form.mdContent.length <= 10) {
            alert("评论内容请最少输入10个字符！");
            return false;
          }
          return true;
        },
        postForm: function () {
          if (this.checkForm() === true) {
            var data = {};
            data.articleId = this.form.articleId;
            data.mdContent = this.form.mdContent;
            if (this.form.authorNickname) {
              data.authorNickname = this.form.authorNickname;
            }
            if (this.form.authorUrl) {
              data.authorUrl = this.form.authorUrl;
            }
            if (this.form.authorEmail) {
              data.authorEmail = this.form.authorEmail;
            }
            $.post("/api/front/comment/create", data, function (res) {
              if (res.code === 0) {
                var url = window.location.origin + window.location.pathname + "?id=" + res.data._id + "#comment-" + res.data._id;
                window.location.href = url;
              } else {
                alert(res.msg);
              }
            });
          }
        }
      }
    })

    //点赞系统
    $("#btnLike").on("click", function () {
      $.post("/api/front/article/like", {
        id: window.articleId
      }, function (res) {
        if (res.code === 0) {
          $(".sl-count").text(" " + (res.data.count) + " 赞");
        } else {
          alert(res.msg);
        }
      });
    });

    //打赏系统
    $("#btnSponsor").on("click", function () {
      $("#myModal").css("display", "block");
    });

  });
})(jQuery);