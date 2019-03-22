module.exports = {

    getType: function (routerName) {
        const prefix = routerName.substring(0, 6);
        if (routerName === "index.html" || routerName === "" || routerName === undefined) {
            return {
                type: 'home'
            }
        } else if (prefix === "index-") {
            let temp = routerName.replace(".html", "");
            if (temp === routerName) {
                return {
                    type: 'notFound'
                }
            }
            let value = temp.split("-")[1];
            let number = Number(value);
            if (value && !isNaN(number)) {
                return {
                    type: 'home',
                    value: number
                }
            } else {
                return {
                    type: 'notFound'
                }
            }
        } else if (routerName.indexOf(".html") !== -1 && routerName !== ".html") { //存在.html 字符串并且不等于 .html
            let temp = routerName.replace(".html", "");
            let number = Number(temp);
            //不是数字
            if (isNaN(number)) {
                if (temp.indexOf("-") !== -1) {
                    let catName = temp.split("-")[0];
                    let pageNum = temp.split("-")[1];
                    let number = Number(pageNum);
                    if (pageNum && !isNaN(number) && temp !== "-") {
                        return {
                            type: 'category',
                            catName: catName,
                            pageNum: number
                        }
                    } else {
                        return {
                            type: 'notFound'
                        }
                    }
                } else {
                    return {
                        type: 'category',
                        catName: temp
                    }
                }
            } else { //是数字就是文章页
                return {
                    type: 'article',
                    value: temp
                }
            }
        } else {
            return {
                type: 'notFound'
            }
        }
    }
}