/**
 * @fileoverview Async functions must end with 'Async'
 * @author Ian Wright
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    type: "suggestion",
    meta: {
        docs: {
            description: "Async functions must end with 'Async'",
            category: "Best Practices",
            recommended: false,
            url: "",
        },
        fixable: "code",
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {
        const MISSING_ASYNC = "Names should end with 'Async' for async functions. Rename '{{name}}' to '{{name}}Async'";
        const EXTRA_ASYNC = "Non async names should not end with 'Async'. Rename '{{name}}Async' to '{{name}}'";

        const endsWithAsync = (name) => name.endsWith("Async");

        /**
         * Check a node is valid
         * @param  {Object}  node       The root node that is being checked
         * @param  {Object}  identifier The identifier of the root node
         * @param  {Boolean} isAsync    Whether the node is marked as async
         */
        const check = (node, identifier, isAsync) => {
            const nameEndsWithAsync = endsWithAsync(identifier.name);

            if (isAsync && !nameEndsWithAsync) {

                context.report({
                    node: node,
                    message: MISSING_ASYNC,
                    data: { name: identifier.name },
                    fix: function(fixer) {
                        return fixer.insertTextAfter(identifier, "Async");
                    },
                });
            }

            if (!isAsync && nameEndsWithAsync) {
                const lastIndex = identifier.name.lastIndexOf("Async");
                const noneAsyncName = identifier.name.substring(0, lastIndex);

                context.report({
                    node: node,
                    message: EXTRA_ASYNC,
                    data: { name: noneAsyncName },
                    fix: function(fixer) {
                        return fixer.replaceText(identifier, noneAsyncName);
                    },
                });
            }
        }

        const VariableDeclarator = (node) => {
            const init = node.init
            const identifier = node.id;

            if (init && identifier) {
                check(node, identifier, init.async);
            }
        };

        const MethodDefinition = (node) => {
            const identifier = node.key;
            const functionExpression = node.value;

            if (identifier && functionExpression) {
                check(node, identifier, functionExpression.async);
            }
        };

        const FunctionDeclaration = (node) => {
            const identifier = node.id;

            if (identifier) {
                check(node, identifier, node.async);
            }
        };

        const AssignmentExpression = (node) => {
            const identifier = node.left;
            const functionExpression = node.right;
            if (identifier && functionExpression && functionExpression.async !== undefined) {
                check(node, identifier, functionExpression.async);
            }
        }

        const Property = (node) => {
            // Only care for Methods
            const identifier = node.key;
            const functionExpression = node.value;

            if (identifier && functionExpression) {
                check(node, identifier, functionExpression.async);
            }
        };

        return {
            VariableDeclarator,
            FunctionDeclaration,
            MethodDefinition,
            Property,
            AssignmentExpression,
        };
    }
};
