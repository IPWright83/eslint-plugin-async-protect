/**
 * @fileoverview Async functions must end with &#39;Async&#39;&#39;
 * @author Ian Wright
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/async-suffix");
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
        `Names should end with 'Async' for async functions. Rename '${name}' to '${name}Async'` :
        `Non async names should not end with 'Async'. Rename '${name}Async' to '${name}'`;


const getFunctionError = (name, asyncMissing) => ({ message: getError(name, asyncMissing), type: "FunctionDeclaration" });
const getMethodError = (name, asyncMissing) => ({ message: getError(name, asyncMissing), type: "MethodDefinition" });
const getVariableError = (name, asyncMissing) => ({ message: getError(name, asyncMissing), type: "VariableDeclarator" });
const getAssignmentError = (name, asyncMissing) => ({ message: getError(name, asyncMissing), type: "AssignmentExpression" });
const getPropertyError = (name, asyncMissing) => ({ message: getError(name, asyncMissing), type: "Property" });

ruleTester.run("async-suffix", rule, {

    valid: [
        { code: `async function fooAsync() { }` },
        { code: `function foo() { }`},
        { code: `const barAsync = async function() { }`},
        { code: `const bar = function() { }`},
        { code: `const bazAsync = async () => { }`},
        { code: `const baz = () => { }`},
        {
            code: `class Foo {
                       async fooAsync() { }
                       foo() {}
                   }`,
        },
        {
            code: `const obj = {
                       async fooAsync() {},
                       foo() {}
                   }`,
        },
        {
            code: `const obj = {
                       barAsync: async function() { },
                       bar: function() {}
                   }`,
        },
        {
            code: `const obj = {
                       bazAsync: async () => { },
                       baz: () => { }
                   }`,
        },
        {
            code: `const obj = {
                       b: foo,
                       c: "test",
                   }`,
        },
        {
            code: `const obj = {
                       async fooAsync() {},
                       foo() {},
                       barAsync: async function() { },
                       bar: function() {},
                       bazAsync: async () => { },
                       baz: () => { }
                   }`,
        },
        {
            code: `let fooAsync;
                   fooAsync = async () => {};
                  `,
        },
        {
            code: `let foo;
                   foo = () => {};
                  `,
        },
        {
            code: `let fooAsync;
                   fooAsync = async function() { };
                  `,
        },
        {
            code: `let foo;
                   foo = function() { };
                  `,
        }
    ],

    invalid: [
        {
            code: `async function foo() { }`,
            errors: [getFunctionError("foo", true)],
        },
        {
            code: `function fooAsync() { }`,
            errors: [getFunctionError("foo", false)],
        },
        {
            code: `const bar = async function() { }`,
            errors: [getVariableError("bar", true)],
        },
        {
            code: `const barAsync = function() { }`,
            errors: [getVariableError("bar", false)],
        },
        {
            code: `const baz = async () => { }`,
            errors: [getVariableError("baz", true)],
        },
        {
            code: `const bazAsync = () => { }`,
            errors: [getVariableError("baz", false)],
        },
        {
            code: `class Foo {
                       async foo() { }
                       fooAsync() {}
                   }`,
            errors: [getMethodError("foo", true), getMethodError("foo", false)],
        },
        {
            code: `const obj = {
                       async foo() {},
                       fooAsync() {}
                   }`,
            errors: [getPropertyError("foo", true), getPropertyError("foo", false)],
        },
        {
            code: `const obj = {
                       bar: async function() { },
                       barAsync: function() {}
                   }`,
            errors: [getPropertyError("bar", true), getPropertyError("bar", false)],
        },
        {
            code: `const obj = {
                       baz: async () => { },
                       bazAsync: () => { }
                   }`,
            errors: [getPropertyError("baz", true), getPropertyError("baz", false)],
        },
        {
            code: `const obj = {
                       async foo() {},
                       fooAsync() {},
                       bar: async function() { },
                       barAsync: function() {},
                       baz: async () => { },
                       bazAsync: () => { }
                   }`,
            errors: [
                getPropertyError("foo", true), getPropertyError("foo", false),
                getPropertyError("bar", true), getPropertyError("bar", false),
                getPropertyError("baz", true), getPropertyError("baz", false),
            ],
        },
        {
            code: `let foo;
                   foo = async () => {};
                  `,
            errors: [getAssignmentError("foo", true)],
        },
        {
            code: `let fooAsync;
                   fooAsync = () => {};
                  `,
            errors: [getAssignmentError("foo", false)],
        },
        {
            code: `let foo;
                   foo = async function() { };
                  `,
            errors: [getAssignmentError("foo", true)],
        },
        {
            code: `let fooAsync;
                   fooAsync = function() { };
                  `,
            errors: [getAssignmentError("foo", false)],
        },
    ]
});
