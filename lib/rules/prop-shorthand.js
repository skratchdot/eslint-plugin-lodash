/**
 * @fileoverview Rule to check if the property shorthand can be used
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = function (context) {
    var _ = require('lodash');
    var aliasMap = require('../util/aliases');
    var detectLodash = require('../util/detect-lodash');

    function shouldPreferProp(func) {
        if (func.type === 'FunctionExpression' && func.params.length) {
            var itemName = func.params[0].name;
            var ret = func.body.body[0];
            return ret && ret.type === 'ReturnStatement' && ret.argument.type === 'MemberExpression' && ret.argument.object && ret.argument.object.name === itemName;
        }
        return false;
    }

    function shouldNodePreferProp(node, whichArg) {
        return node.arguments && node.arguments.length > whichArg && shouldPreferProp(node.arguments[whichArg]);
    }

    //function isInSupports(name) {
    //    return _.includes(aliasMap.supportsProp, name);
    //}

    function isLodashCollectionFunction(node) {
        return _.get(node, 'callee.object.name') === '_' && _.includes(aliasMap.supportsProp, _.get(node, 'callee.property.name'));
    }

    return {
        CallExpression: function (node) {
            try {
                if (isLodashCollectionFunction(node) && shouldNodePreferProp(node, 1)) {
                    context.report(node.callee.property, 'Prefer property shorthand syntax');
                } else if (_.includes(aliasMap.supportsProp, _.get(node, 'callee.property.name')) && detectLodash.isWrapper(node.callee.object) && shouldNodePreferProp(node, 0) ) {
                    context.report(node.callee.property, 'Prefer property shorthand syntax');
                }
            } catch (e) {
                context.report(node, 'Error executing rule: ' + e);
            }
        }
    };
};

module.exports.schema = [
    // JSON Schema for rule options goes here
];