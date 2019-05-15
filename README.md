# jscms-server

jscms-server，jscms服务端，基于阿里的 [eggjs](https://github.com/eggjs/egg) 开发。

## TODO

1. 替换 www.zhutibaba.com 网址。（完成
1. 网站配置增加站长信息（个人二维码、微信公众号二维码，联系方式等）。（完成
1. 完善主题未完成功能。（未完成

1. API 相关控制器代码优化（完成
1. 验证码系统（完成
1. 网站公告（完成
1. 搜索词排名记数（完成
1. 前台搜索热词展示（完成
1. 用户反馈系统（未完成
1. 前台注册/登陆（未完成
1. 邮箱激活验证（未完成
1. 前台用户中心（未完成
1. 前台评论系统（未完成

## 模版变量

变量名 | 描述
---|---
[RENDER_DATA](#RENDER_DATA) | 全局渲染数据，包括文章推荐等数据信息。
[RENDER_PARAM](#RENDER_PARAM) | 渲染参数，与当前的页面相关。
[WEB_CONFIG](#WEB_CONFIG) | 网站公共配置。
[CONSTANT](#CONSTANT) | 程序常量。

### RENDER_DATA

变量名 | 描述
---|---
``recentArticles3``: Array | 最近三篇文章。
``randomArticles3``: Array | 随机三篇文章。
``recentComments3``: Array | 最近三条评论。
``hotArticles5``: Array | 浏览量最多的5篇文章。
``commentTopArticles5``: Array | 获取评论量最多的5篇文章。

### RENDER_PARAM

#### 文章页（Article）

变量名 | 描述
---|---
``pageType``: String | 页面的类型，文章页是``article``
``numberId``: Number | 文章数字id。
``article``: Object | 文章对象。
``comments``: Array | 文章的评论。
``relate``: Array | 相关文章。
