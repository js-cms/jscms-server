'use strict';

const MarkdownIt = require('markdown-it');
const validator = require('validator');
const jsxss = require('xss');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const cheerio = require('cheerio');

moment.locale('zh-cn'); // 使用中文

// Set default options
const md = new MarkdownIt();

md.set({
    html: false, // Enable HTML tags in source
    xhtmlOut: false, // Use '/' to close single tags (<br />)
    breaks: false, // Convert '\n' in paragraphs into <br>
    linkify: true, // Autoconvert URL-like text to links
    typographer: true, // Enable smartypants and other sweet transforms
});

md.renderer.rules.fence = (tokens, idx) => {
    const token = tokens[idx];
    let language = (token.info && 'language-' + token.info) || '';
    language = validator.escape(language);

    return (
        '<pre class="prettyprint ' +
        language +
        '">' +
        '<code>' +
        validator.escape(token.content) +
        '</code>' +
        '</pre>'
    );
};

md.renderer.rules.code_block = (tokens, idx /* , options */ ) => {
    const token = tokens[idx];

    return (
        '<pre class="prettyprint">' +
        '<code>' +
        validator.escape(token.content) +
        '</code>' +
        '</pre>'
    );
};

const myxss = new jsxss.FilterXSS({
    onIgnoreTagAttr(tag, name, value) {
        // 让 prettyprint 可以工作
        if (tag === 'pre' && name === 'class') {
            return name + '="' + jsxss.escapeAttrValue(value) + '"';
        }
    },
});

exports.markdown = text => {
    return (
        '<div class="markdown-text">' +
        myxss.process(md.render(text || '')) +
        '</div>'
    );
};

exports.escapeSignature = signature => {
    return signature
        .split('\n')
        .map(p => {
            return validator.escape(p);
        })
        .join('<br>');
};

exports.tabName = function (tab) {
    const pair = this.app.config.tabs.find(pair => {
        return pair[0] === tab;
    });
    if (pair) {
        return pair[1];
    }
};

exports.proxy = function (url) {
    return url;
    // 当 google 和 github 封锁严重时，则需要通过服务器代理访问它们的静态资源
    // return '/agent?url=' + encodeURIComponent(url);
};

exports.ago = function (date) {
    date = moment(date);

    return date.fromNow();
};

exports.toDate = function(time, type) {
    if ( type === 1 || !type ) {
        return moment(time).format('YYYY-MM-DD HH:mm');
    } else if ( type === 2 ) {
        return moment(time).format('YYYY-MM-DD');
    }
}

exports.validateId = str => {
    return /^[a-zA-Z0-9\-_]+$/i.test(str);
};

exports.bhash = str => {
    return bcrypt.hashSync(str, 10);
};

exports.bcompare = (str, hash) => {
    return bcrypt.compareSync(str, hash);
};

exports.randNum = function (min, max) {
    return parseInt(Math.random() * (max - min + 1) + min, 10);
}

exports.throwError = function (ctx, msg, code) {
    ctx.body = {
        code: code ? code : 1,
        msg: msg,
    };
    return false;
}

exports.toHttps = function(url) {
    return url.replace("http://", "https://");
}


/**
 * 截取字符串 中英文混合
 * @param str	待处理字符串
 * @param len	截取字节长度 中文2字节 英文1字节
 */
exports.subString = function(str, len){
	var regexp = /[^\x00-\xff]/g;// 正在表达式匹配中文
	// 当字符串字节长度小于指定的字节长度时
	if (str.replace(regexp, "aa").length <= len) {
		return str;
	}
	// 假设指定长度内都是中文
	var m = Math.floor(len/2);
	for (var i = m, j = str.length; i < j; i++) {
		// 当截取字符串字节长度满足指定的字节长度
		if (str.substring(0, i).replace(regexp, "aa").length >= len) {
			return str.substring(0, i);
		}
	}
	return str;
}

exports.heightlight = function(keyword, str) {
    let reg = new RegExp(keyword, 'ig');
    return str.replace(reg, "<span class=\"keyword\">"+keyword+"</span>");
}

exports.goByParams = function (params) {
    var _params = "?";
    for (var key in params) {
        _params += key + "=" + (params[key]) + "&";
    }
    return _params.substring(0, _params.length - 1);
}

//判断是不是ObjectId
exports.isObjectId = function(id) {
    return id.length === 24 && parseInt(id.toString().substring(0, 8), 16) > 1000000000;
}

//返回404
exports.return404 = async function(ctx) {
    ctx.status = 404;
    return ctx.render('/pages/404');
}

//获取摘要
exports.getAbstract = function(content, number) {
    let text = "";
    if ( content.indexOf("<p") !== -1 ) {
        let $ = cheerio.load("<div id='container'>" + content + "</div>", { decodeEntities: false });
        text = $("#container").text();
    } else {
        text = content;
    }
    return this.subString(text, number) + "...";
}