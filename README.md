# jscms-server

jscms-server，jscms服务端，基于阿里的 [eggjs](https://github.com/eggjs/egg) 开发。

## 等待完善

1. API 相关控制器代码优化（未完成

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
