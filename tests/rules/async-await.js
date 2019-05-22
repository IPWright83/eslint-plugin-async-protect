/**
 * @fileoverview Ensure functions with &#39;Async&#39; naming convention are awaited
 * @author Ian Wright
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../src/async-await");
const RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
    parserOptions: {
        ecmaVersion: 8,
    },
});

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
const ruleTester = new RuleTester();

const getError = (name, asyncMissing) => asyncMissing ?
        `The call to '${name}' is missing an await` :
        `The call to '${name}' has an un-needed await`;

ruleTester.run("async-await", rule, {

    valid: [
        {
            code: `
                (iife = async function() {
                    await fooAsync();
                })();`
        },
        {
            code: `
                (iife = async function() {
                    foo();
                })();`
        },
        {
            code: `
                (iife = async function() {
                    const result = await fooAsync();
                })();`
        },
        {
            code: `
                (iife = async function() {
                    const result = foo();
                })();`
        },
        {
            code: `
                (iife = async function() {
                    (await fooAsync()).doSomething();
                })();`
        },
        {
            code: `
                (iife = async function() {
                    foo().doSomething();
                })();`
        },
        {
            code: `
                (iife = async function() {
                    const result = (await fooAsync()).x;
                })();`
        },
        {
            code: `
                (iife = async function() {
                    const result = foo().x;
                })();`
        },
        {
         code: `
            (iife = async function() {
                const result = (await fooAsync()).x.y.z().a.doSomething();
            })();`
        },
        {
         code: `
            (iife = async function() {
                const result = await foo().x.y.z().a.doSomethingAsync();
            })();`

        },
        {
         code: `
            (iife = async function() {
                const result = (await foo().x.y.zAsync()).a.doSomething();
            })();`

        },
    ],

    invalid: [
        {
            code: `
                (iife = async function() {
                    fooAsync();
                })();`,
            errors: [{ message: getError("fooAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    await foo();
                })();`,
            errors: [{ message: getError("foo", false), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    const result = fooAsync();
                })();`,
            errors: [{ message: getError("fooAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    const result = await foo();
                })();`,
            errors: [{ message: getError("foo", false), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    (fooAsync()).doSomething();
                })();`,
            errors: [{ message: getError("fooAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    fooAsync().doSomething();
                })();`,  // accessing doSomething() too early / not async
            errors: [{ message: getError("fooAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    await fooAsync().x();
                })();`,
            errors: [
                { message: getError("x", false), type: "CallExpression" },
                { message: getError("fooAsync", true), type: "CallExpression" },
            ],
        },
        {
            code: `
                (iife = async function() {
                    foo().doSomethingAsync();
                })();`,
            errors: [{ message: getError("doSomethingAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    const result = (await foo()).x;
                })();`,
            errors: [{ message: getError("foo", false), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    const result = (fooAsync()).x;
                })();`,
            errors: [{ message: getError("fooAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    const result = fooAsync().x;
                })();`,
            errors: [{ message: getError("fooAsync", true), type: "CallExpression" }],
        },
        {
            code: `
                (iife = async function() {
                    const result = fooAsync().x();
                })();`,
            errors: [{
                message: getError("fooAsync", true),
                type: "CallExpression",
            }],
        },
        {
            code: `
                (iife = async function() {
                    const result = foo().xAsync();
                })();`,
            errors: [{
                message: getError("xAsync", true),
                type: "CallExpression",
            }],
        },
        {
            code: `
                (iife = async function() {
                    const result = (await foo()).x.y.zAsync().a.doSomething();
                })();`,
            errors: [
                { message: getError("zAsync", true), type: "CallExpression" },
                { message: getError("foo", false), type: "CallExpression" },
            ],
        },
        {
            code: `
                (iife = async function() {
                    const result = await foo().x.y.zAsync().a.doSomething();
                })();`,
            errors: [
                { message: getError("doSomething", false), type: "CallExpression" },
                { message: getError("zAsync", true), type: "CallExpression" },
            ],
        },
        {
            code: `
                (iife = async function() {
                    const result = foo().x.y.z().a.doSomethingAsync();
                })();`,
            errors: [{ message: getError("doSomethingAsync", true), type: "CallExpression" }]

        },
        {
            code: `
                (iife = async function() {
                    const result = await fooAsync().x.y.z().a.doSomething();
                })();`,
             errors: [
                { message: getError("doSomething", false), type: "CallExpression" },
                { message: getError("fooAsync", true), type: "CallExpression" },
            ],
        },
    ]
});
