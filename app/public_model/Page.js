const PublicModel = require('./PublicModel');

/**
 * 自定义页面 数据表模型
 */
class Page extends PublicModel {

    constructor(Schema) {

        super(Schema);
        
        //页面主要标题
        this.title = {
            name: '页面标题',
            backend: {
                type: 'String',
                default: '',
                required: true,
            },
            frontend: {
                type: 'input-text',
                formRequired: true,
                formField: true,
                tableField: true
            }
        }

        //页面关键字
        this.keywords = {
            name: '页面关键字',
            backend: {
                type: 'String',
                default: '',
                required: true,
            },
            frontend: {
                type: 'input-text',
                formRequired: true,
                formField: true,
                tableField: true
            }
        }

        //页面描述
        this.description = {
            name: '页面描述',
            backend: {
                type: 'String',
                default: '',
                required: true,
            },
            frontend: {
                type: 'input-text',
                formRequired: true,
                formField: true,
                tableField: true
            }
        }

        //页面名称
        this.name = {
            name: '页面名称',
            backend: {
                type: 'String',
                default: '',
                required: true,
            },
            frontend: {
                type: 'input-text',
                formRequired: true,
                formField: true,
                tableField: true
            }
        }

        //页面别名
        this.alias = {
            name: '页面别名',
            backend: {
                type: 'String',
                default: '',
                required: true,
            },
            frontend: {
                type: 'input-text',
                formRequired: true,
                formField: true,
                tableField: true
            }
        }

        //页面html内容
        this.html = {
            name: '页面html内容',
            backend: {
                type: 'String',
                default: '',
                required: true,
            },
            frontend: {
                type: 'input-textarea',
                formRequired: true,
                formField: true,
                tableField: false
            }
        }

        //数据创建时间
        this.createTime = {
            name: '创建时间',
            backend: {
                type: 'Number',
                required: true,
            },
            frontend: {
                type: 'input-date',
                formRequired: false,
                formField: false,
                tableField: true
            }
        }

        //数据更新时间
        this.updateTime = {
            name: '更新时间',
            backend: {
                type: 'Number',
                required: true,
            },
            frontend: {
                type: 'input-date',
                formRequired: false,
                formField: false,
                tableField: false
            }
        }
    }
}

module.exports = Page