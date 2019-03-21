$(function () {
    //弹窗html
    var popHtml = "<div class='pop-mask'><div class='modal'><div class='head'><i class='imgicon-close'></div><div class='body'><img class='wechat-serach-poster' src='/public/images/contact-pop.png' ></div></div></div>";
    //地址对象
    var location = window.location;
    //是否是手机端
    var isMobile = (function() {
        var _isMobile = false;
        var sUserAgent = navigator.userAgent;
        if (sUserAgent.indexOf('Android') > -1 || 
            sUserAgent.indexOf('iPhone') > -1 || 
            sUserAgent.indexOf('iPad') > -1 || 
            sUserAgent.indexOf('iPod') > -1 || 
            sUserAgent.indexOf('Symbian') > -1) {
            _isMobile = true;
        }
        return _isMobile;
    })();
    //元素动画库
    var eleAnimated = {
        in: function (ele, anName, callback) {
            $(ele).addClass(anName + " animated")
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function () {
                        $(this).removeClass(anName).removeClass("animated");
                        if (typeof callback === "function") {
                            callback();
                        }
                    });
        },
        out: function (ele, anName, callback) {
            $(ele).addClass(anName + " animated")
                .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
                    function () {
                        $(this).removeClass(anName).removeClass("animated");
                        $(ele).remove();
                        if (typeof callback === "function") {
                            callback();
                        }
                    });
        }
    }
    //事件绑定
    var bind = {
        //反馈建议点击事件
        "feedback-btn-click": function () {
            $(".nav-btn-item .btn-red").on("click", function (e) {
                var pop = $(popHtml);
                $("body").append(pop);
                $('.pop-mask').on("click", function () {
                    $(this).remove();
                });
            });
        },
        //搜索框回车事件
        "search-input-keyup": function () {
            $(".nav-search-item input").on("keyup", function (e) {
                if (!this.value) return
                if (e.keyCode === 13) {
                    window.location.href = "/search?q=" + this.value;
                }
            });
        },
        //点击放大查看图片
        "view-image-click": function (selector) {
            selector = selector || ".ui_qtext_image";
            $(selector).on("click", function (e) {
                var that = this;
                var src = $(this).attr("src");
                var popImageHtml = "<div class=\"pop-mask\"><img class=\"zoom-img\" src=\"" + src + "\" ></div>";
                $("body").append($(popImageHtml));
                eleAnimated.in(".zoom-img", "zoomIn");
                $('.pop-mask').on("click", function (e) {
                    eleAnimated.in(".zoom-img", "zoomOut", function () {
                        $('.pop-mask').remove();
                    });
                });
            });
        },
        //点击查看英文原文弹窗
        "show-enbtn-click": function () {
            $(".btn-showen").on("click", function (e) {
                var closeContentWarp = function (callback) {
                    if ($(".en-content-warp").length === 0) {
                        if (typeof callback === "function") {
                            callback();
                            return;
                        }
                    }
                    if ( isMobile ) {
                        $("body").css("overflow", "visible");
                    }
                    eleAnimated.out(".en-content-warp", "fadeOutRight", callback);
                }
                var answerId = $(this).attr("data-answerId");
                var initEle = function (callback) {
                    var answer = {}
                    var loadHtml = "<div class=\"loading-warp\" style=\"border: none;\">" +
                    "<div class=\"loading-content\">" +
                    "<div class=\"loading-column\">" +
                    "<div class=\"loading-container animation-3\">" +
                    "<div class=\"shape shape1\"></div>" +
                    "<div class=\"shape shape2\"></div>" +
                    "<div class=\"shape shape3\"></div>" +
                    "<div class=\"shape shape4\"></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
                    var enContentWarpHtml = "<div class=\"en-content-warp\"><i class=\"pngicon-close\" @click=\"close()\"></i>\n        <div class=\"answer-warp\" style=\"border:none;margin-top: 30px;padding:0px;height:calc(100% - 40px);overflow:hidden;overflow-y: auto;-webkit-overflow-scrolling: touch;\">\n  "+ loadHtml +"      <div class=\"question-link\">\n            <a :href=\"'/question/'+ answer.questionId._id +'.html'\" :title=\"answer.questionId.enTitle\">{{answer.questionId.enTitle}}</a>\n        </div>\n        <div class=\"answer-user\">\n            <div class=\"photo-wrapper\">\n                <img :src=\"answer.authorAvatar\" alt=\"\">\n            </div>\n            <div class=\"user-info\">\n                <div class=\"user-intro\">{{answer.authorName}}\uFF0C{{answer.authorIntro}}</div>\n                <div class=\"answer-permalink\">\n                    <a :href=\"'/answer/'+ answer._id +'.html'\">{{answer.date}} \xB7 (\u70B9\u51FB\u6B64\u5904\u67E5\u770B\u8BE5\u56DE\u7B54)</a>\n                </div>\n            </div>\n        </div>\n        <div class=\"answer-preview htmlContent\" v-html=\"answer.htEnContent\">\n</div>\n    </div>\n        </div>";
                    var enContentWarpELe = $(enContentWarpHtml);
                    var elemsImg = enContentWarpELe.find(".ui_qtext_image_wrapper img");
                    $("body").append(enContentWarpELe);
                    eleAnimated.in(".en-content-warp", "fadeInRight");
                    //如果是手机端就先禁止body滚动
                    if ( isMobile ) {
                        $("body").css("overflow", "hidden");
                    }
                    setTimeout(function() {
                        callback(answer);
                    }, 500);
                }
                var newVue = function (data) {
                    var enContentComponent = new Vue({
                        el: ".en-content-warp",
                        data: function () {
                            return {
                                answer: data
                            }
                        },
                        methods: {
                            close: function() {
                                closeContentWarp();
                            }
                        }
                    });
                }
                var init = function () {
                    initEle(function(data) {
                        $.get("/api/v1/answer?answerId=" + answerId, function (res) {
                            $(".loading-warp").remove();
                            newVue(res.data);
                            setTimeout(function () {
                                bind["view-image-click"]();
                            }, 100);
                        });
                    });
                }
                closeContentWarp(init);
            });
        },
        //绑定顶部搜索框点击事件
        "search-input-click": function () {
            $(".nav-search-item").on("click", function () {
                $(this).find(".last-keywords").remove();
            });
        }
    }
    //各页面初始化方法
    var pages = {
        //共公初始化方法
        '$public': function () {
            bind["feedback-btn-click"]();
            bind["search-input-keyup"]();
            bind["view-image-click"]();
            bind["show-enbtn-click"]();
            bind["search-input-click"]();
        },
        //首页
        '/|/index.html|/index/': function () {
            $(".answer-warp").on("click", function (e) {
                if ($(e.target).hasClass("btn-blue")) {
                    $(this).find(".mask").remove();
                    $(this).find(".limit180").removeClass("limit180");
                }
            });
        },
        //搜索页
        '/search': function () {
            var parseUrl = function () {
                var url = location.search; //获取url中"?"符后的字串
                var theRequest = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    console.log(strs)
                    for (var i = 0; i < strs.length; i++) {
                        theRequest[strs[i].split("=")[0]] = decodeURIComponent(strs[i].split("=")[1]);
                    }
                }
                return theRequest;
            }
            var goByParams = function (params) {
                var _params = "?";
                for (var key in params) {
                    _params += key + "=" + (params[key]) + "&";
                }
                return _params.substring(0, _params.length - 1);
            }

            var params = parseUrl();
            $(".nav-search-item input").val(params.q);
            $(".search-filters-warp").on("click", function (e) {
                var ele = e.target;
                if (ele.nodeName === "A") {
                    var tempArr = $(ele).attr("data-value").split("=");
                    var name = tempArr[0];
                    var value = tempArr[1];
                    params[name] = value;
                    window.location.href = "/search" + goByParams(params);
                }
            });

            $(".question-item-warp").on("click", function (e) {
                if (e.target.className === "show-more") {
                    var answerId = $(this).attr("data-id");
                    var html = "<div class=\"loading-warp\" style=\"border: none;\">" +
                        "<div class=\"loading-content\">" +
                        "<div class=\"loading-column\">" +
                        "<div class=\"loading-container animation-3\">" +
                        "<div class=\"shape shape1\"></div>" +
                        "<div class=\"shape shape2\"></div>" +
                        "<div class=\"shape shape3\"></div>" +
                        "<div class=\"shape shape4\"></div>" +
                        "</div>" +
                        "</div>" +
                        "</div>" +
                        "</div>";
                    var loading = $(html);
                    $(this).find(".answer-summary").remove();
                    $(this).append(loading);
                    var tempApp = new Vue({
                        el: "#id" + answerId,
                        data: function () {
                            return {
                                isShowAnswer: false,
                                answer: {}
                            }
                        },
                        mounted: function () {
                            var that = this;
                            $.get("/api/v1/answer?answerId=" + answerId, function (res) {
                                setTimeout(function () {
                                    that.answer = res.data;
                                    $("#id" + answerId + " .loading-warp").remove();
                                    $("#id" + answerId + " .answer-warp").css("display", "");
                                    that.isShowAnswer = true;
                                    bind["show-enbtn-click"]();
                                    setTimeout(function () {
                                        bind["view-image-click"]();
                                    }, 300);
                                }, 500);
                            });
                        }
                    })
                }
            });

            //作者输入框回车键监听
            $("input.author-input").on("keyup", function (e) {
                if (!this.value) return
                if (e.keyCode === 13) {
                    params.author = this.value;
                    window.location.href = "/search" + goByParams(params);
                }
            });
        }
    }

    for (var key in pages) {
        var method = pages[key];
        if ( key === "$public" ) {
            method();
        } else {
            if ( key.indexOf("|") !== -1 ) {
                var pathArr = [];
                pathArr = key.split("|");
                pathArr.forEach(function (path) {
                    if ( location.pathname === path ) {
                        method();
                    } else if ( location.pathname.indexOf(path) !== -1 ) {
                        method();
                    }
                });
            } else if ( location.pathname === key ) {
                method();
            }
        }
    }
});