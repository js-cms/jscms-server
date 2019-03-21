'use strict';

const Controller = require('egg').Controller;
const _ = require('lodash');
const marked = require('marked');

// 数据校验函数
const validate = function (object) {
    return {
        code: 0,
        object: object
    }
}

// 数组混合
const mixinArray = function (arr1, arr2) {
    let _arr2 = arr2 ? arr2 : [];
    let newArr = arr1.concat(_arr2);
    return [...new Set(newArr)];
}

/**
 * 文章相关api
 */
class ArticleController extends Controller {

    //安装时的初始化
    async install() {
        const { ctx, service, config } = this;
        if (ctx.app.config.env !== "local") {
            return ctx.helper.throwError(ctx, "没有操作权限");
        }

        let parameters = ctx.request.body;

        if (!parameters.categoryName) {
            return ctx.helper.throwError(ctx, "缺少参数");
        }

        //查找默认分类
        let findCatRes = await service.category.findOne({
            name: parameters.categoryName
        });

        if (!findCatRes) {
            return ctx.helper.throwError(ctx, "没有找到该分类");
        }

        //查找默认超级管理员邮箱
        let findUserRes = await service.user.getUserByMail(parameters.userEmail);

        if (!findUserRes) {
            return ctx.helper.throwError(ctx, "没有找到该超级用户");
        }

        let findRes = await service.article.findOne({
            title: parameters.title
        });

        if (findRes) {
            return ctx.helper.throwError(ctx, "默认文章已存在");
        }

        parameters.userId = findUserRes._id;
        parameters.categoryId = findCatRes._id;
        parameters.htContent = marked(parameters.mdContent);
        delete parameters.categoryName;
        delete parameters.userEmail;

        //文章创建结果
        const createArticleRes = await service.article.create(parameters);
        
        //更新标签列表
        let findTagsRes = await service.config.findOne({alias: 'tags'});
        let tempTags = mixinArray(parameters.keywords, findTagsRes.info);
        let newTags = [];
        tempTags.forEach(tag => {
            if ( tag !== '' && tag !== ' ' && tag !== '.' ) {
                newTags.push(tag);
            }
        });
        let saveTagsRes = await service.config.update(findTagsRes._id, {info: newTags});

        if (createArticleRes._id) {
            ctx.body = {
                code: 0,
                msg: "默认文章创建完成",
                data: createArticleRes
            }
        } else {
            return ctx.helper.throwError(ctx, "默认文章创建失败");
        }
    }

    //点赞文章
    async like() {
        const { ctx, service, config } = this;
        const id = ctx.request.body.id;
        if (!id) {
            return ctx.helper.throwError(ctx, "参数错误");
        }

        //给文章增加点赞数
        const updateArticleRes = await service.article.update(
            id,
            {
                $inc: { likeCount: Number(1) }
            }
        );
        console.log(updateArticleRes);
        ctx.body = {
            code: 0,
            data: {
                count: updateArticleRes.likeCount + 1
            }
        }
    }
 
    //新增文章
    async create() {
        const { ctx, service, config } = this;
        if (!ctx.locals.currentUser.auth.isLogin) {
            return ctx.helper.throwError(ctx, "你没有登陆", 101);
        }
        const userId = ctx.locals.currentUser.user._id;
        const validateResult = validate(ctx.request.body);
        //校验失败
        if (validateResult.code === 1) {
            return ctx.helper.throwError(ctx, validateResult.msg, validateResult.code);
        }
        //统计文章数量
        let configCountRes = await service.config.findOne({alias: 'articleCount'});
        let num = Number(configCountRes.info.num) + 1;
        let saveCountRes = await service.config.update(configCountRes._id, {info:{num: num}});

        let parameters = validateResult.object;
        parameters.serialNumber = num;
        //文章创建结果
        parameters.htContent = marked(parameters.mdContent);
        parameters.userId = userId;

        //如果有分类名称，就查分类，并带入id
        if ( parameters.categoryName ) {
            let findCatRes = await service.category.findOne({
                name: parameters.categoryName
            });
            parameters.categoryId = findCatRes._id;
            delete parameters.categoryName;
        }
        
        const createArticleRes = await service.article.create(parameters);
        //给分类增加文章数结果
        const updateCategoryRes = await service.category.update(
            parameters.categoryId,
            {
                $inc: { articleCount: Number(1) }
            }
        );

        //更新标签列表
        let findTagsRes = await service.config.findOne({alias: 'tags'});
        let newTags = mixinArray(parameters.keywords, findTagsRes.info);
        let saveTagsRes = await service.config.update(findTagsRes._id, {info: newTags});

        //如果文章添加成功
        if (createArticleRes._id && updateCategoryRes) {
            // 设置响应体和状态码
            ctx.body = {
                code: 0,
                msg: '文章创建成功',
                data: createArticleRes
            };
        } else {
            return ctx.helper.throwError(ctx, "文章创建失败");
        }
    }

    //更新文章
    async update() {
        const { ctx, service, config } = this;
        if (!ctx.locals.currentUser.auth.isLogin) {
            return ctx.helper.throwError(ctx, "你没有登陆", 101);
        }

        const id = ctx.request.body.id;

        if (!id) {
            return ctx.helper.throwError(ctx, "参数错误");
        }

        let info = ctx.request.body;
        if ( info.mdContent ) {
            info.htContent = marked(info.mdContent);
        }
        const updateRes = await service.article.update(id, info);

        if ( info.keywords && info.keywords.length ) {
            //更新标签列表
            let findTagsRes = await service.config.findOne({alias: 'tags'});
            let newTags = mixinArray(info.keywords, findTagsRes.info);
            let saveTagsRes = await service.config.update(findTagsRes._id, {info: newTags});
        }

        if (updateRes) {
            ctx.body = {
                code: 0,
                msg: "更新成功",
                data: updateRes
            };
        } else {
            return ctx.helper.throwError(ctx, "更新失败");
        }
    }

    //删除文章
    async delete() {
        const { ctx, service, config } = this;
        if (!ctx.locals.currentUser.auth.isLogin) {
            return ctx.helper.throwError(ctx, "你没有登陆", 101);
        }

        const id = ctx.request.body.id;

        if (!id) {
            return ctx.helper.throwError(ctx, "参数错误");
        }

        const deleteRes = await service.article.remove(id);

        if (deleteRes) {
            ctx.body = {
                code: 0,
                msg: "文章删除完成"
            }
        } else {
            return ctx.helper.throwError(ctx, "文章删除失败");
        }
    }

    //获取文章列表
    async list() {
        const { ctx, service, config } = this;
        if (!ctx.locals.currentUser.auth.isLogin) {
            return ctx.helper.throwError(ctx, "你没有登陆", 101);
        }
        const categoryId = ctx.query.categoryId;
        const keyword = ctx.helper.escape(ctx.query.keyword);
        let pageSize = Number(ctx.query.pageSize);
        let pageNumber = Number(ctx.query.pageNumber);
        pageSize = isNaN(pageSize) ? 10 : pageSize;
        pageNumber =  isNaN(pageNumber)? 0 : pageNumber;

        let reg = new RegExp(keyword, 'i'); //不区分大小写

        let whereAnd = [];
        let where = {}
        if ( categoryId && categoryId != 0 ) {
            whereAnd.push({
                categoryId: categoryId
            });
        }
        if ( ctx.query.keyword ) {
            whereAnd.push({
                title: {$regex : reg}
            });
        }
        if ( whereAnd.length ) {
            where = {
                "$and": whereAnd
            }
        }

        //获取文章列表
        const findArticleRes = await service.article.search(where, pageNumber, pageSize);
        //获取文章总数
        const countArticleRes = await service.article.count(where);

        ctx.body = {
            code: 0,
            msg: '查询成功',
            data: {
                list: findArticleRes,
                total: countArticleRes
            }
        };
    }

    //获取单个文章信息
    async show() {
        const { ctx, service, config } = this;
        if (!ctx.locals.currentUser.auth.isLogin) {
            return ctx.helper.throwError(ctx, "你没有登陆", 101);
        }
        const id = ctx.query.id;
        if (!id) {
            return ctx.helper.throwError(ctx, "参数错误");
        }

        //获取文章
        const findArticleRes = await service.article.findOne({ _id: id });

        if (findArticleRes) {
            ctx.body = {
                code: 0,
                msg: '查询成功',
                data: findArticleRes
            };
        } else {
            return ctx.helper.throwError(ctx, "文章查询失败");
        }
    }
}

module.exports = ArticleController;