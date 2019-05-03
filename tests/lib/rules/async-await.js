/**
 * @fileoverview Ensure functions with &#39;Async&#39; naming convention are awaited
 * @author Ian Wright
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------
const rule = require("../../../lib/rules/async-await");
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

ruleTester.run("async-await", rule, {

    valid: [
        { code: `await fooAsync();` },
        { code: `foo();` },
        { code: `const result = await fooAsync();` },
        { code: `const result = foo();` },
        { code: `(await fooAsync()).doSomething();` },
        { code: `foo().doSomething();` },
        { code: `const result = (await fooAsync()).x;` },
        { code: `const result = foo().x;` },
        { code: `await Promise.all([foo2(), foo3()]);` },
    ],

    invalid: [
        {
            code: "fooAsync();",
            errors: [{}],
        },
        {
            code: "await foo();",
            errors: [{}],
        },
        {
            code: "const result = fooAsync();",
            errors: [{}],
        },
        {
            code: "const result = await foo();",
            errors: [{}],
        },
        {
            code: "(fooAsync()).doSomething();",
            errors: [{}],
        },
        {
            code: "fooAsync().doSomething();",  // accessing doSomething() too early / not async
            errors: [{}],
        },
        {
            code: "await (foo()).doSomething();",
            errors: [{}],
        },
        {
            code: "const result = (await foo()).x;",
            errors: [{}],
        },
        {
            code: "const result = (fooAsync()).x;",
            errors: [{}],
        },
        {
            code: "const result = fooAsync().x;",
            errors: [{}],
        },
        {
            code: "const result = fooAsync().x;",
            errors: [{}],
        },
        {
            code: "Promise.all([foo2(), foo3()]);",
            errors: [{}],
        },
    ]
});
