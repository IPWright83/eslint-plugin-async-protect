/**
 * @fileoverview Ensure functions with 'Async' naming convention are awaited
 * @author Ian Wright
 */
"use strict";

const { ignoreAngularFunctionName } = require("./ignoreAngularFunctionName");

module.exports = {
    type: "suggestion",
    meta: {
        docs: {
            description: "enforce functions with 'Async' naming convention are awaited",
            category: "Possible Errors",
            recommended: true,
            url: "",
        },
    },

    create: function (context) {
        const MISSING_AWAIT = "The call to '{{name}}' is missing an await";
        const EXTRA_AWAIT = "The call to '{{name}}' has an un-needed await";

        const endsWithAsync = (name) => name.endsWith("Async");

        const getName = (node) => {
            switch (node.type) {
                case "CallExpression": {
                    return getName(node.callee);
                }

                case "MemberExpression":
                    return getName(node.property);

                case "Identifier":
                    return { node, name: node.name };
            }

            return null;
        };

        // Has the call been awaited?
        const isAwaited = (node) => {
            // Immediate parent is Await so it's async
            return node.parent.type === "AwaitExpression";
        };

        const isReturned = (node) => {
            // Immediate parent is "return" so we are returning
            return node.parent.type === "ReturnStatement";
        };

        const CallExpression = (node) => {
            // Grab the IdentifierNode. If this isn't a pattern
            // we know about just abort
            const idNode = getName(node);
            if (!idNode) {
                return;
            }

            // Were async functions called with an await?
            const calledWithAwait = isAwaited(node);
            const calledWithReturn = isReturned(node);
            const nameEndsWithAsync = endsWithAsync(idNode.name);

            // Skip the rule if this looks like an angular lifecycle event
            if (ignoreAngularFunctionName(idNode.name)) {
                return;
            }

            if (nameEndsWithAsync && !calledWithAwait && !calledWithReturn) {
                context.report({
                    node: node,
                    message: MISSING_AWAIT,
                    data: { name: idNode.name },
                });
            }

            if (!nameEndsWithAsync && calledWithAwait) {
                context.report({
                    node: node,
                    message: EXTRA_AWAIT,
                    data: { name: idNode.name },
                });
            }
        };

        return {
            CallExpression,
        };
    },
};
