/**
 * 基础模型类，提供一些转换方法
 */

const getMongooseType = function (type, Schema) {
    switch (type) {
        case 'String':
            return String;
            break;
        case 'Number':
            return Number;
            break;
        case 'Date':
            return Date;
            break;
        case 'Buffer':
            return Buffer;
            break;
        case 'Boolean':
            return Boolean;
            break;
        case 'Mixed':
            return Schema ? Schema.Types.Mixed : String;
            break;
        case 'Objectid':
            return Schema ? Schema.Types.Objectid : String;
            break;
        case 'Object':
            return Object;
            break;
        case 'Array':
            return Array;
            break;
    }
}

class PublicModel {

    constructor(Schema = false) {
        Object.defineProperty(this, '_Schema', {
            value: Schema,
            enumerable: false
        });
    }

    toWebSchema() {
        let schema = {};
        for (let key in this) {
            let field = this[key];
            if ( field && field.name ) {
                schema[key] = {
                    type: field.frontend.type,
                    name: field.name,
                    formRequired: field.frontend.formRequired,
                    formField: field.frontend.formField,
                    tableField: field.frontend.tableField
                }
                if ( field.frontend.default ) {
                    schema[key].default = field.frontend.default;
                }
            }
        }
        return schema;
    }

    toMongooseSchema() {
        let schema = {};
        for (let key in this) {
            let field = this[key];
            if ( field && field.name ) {
                schema[key] = {};
                schema[key].type = getMongooseType(field.backend.type, this._Schema);
                if (field.backend.default !== undefined) {
                    schema[key].default = field.backend.default;
                }
            }
        }
        return schema;
    }

}

module.exports = PublicModel