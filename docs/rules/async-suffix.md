# Async functions must end with &#39;Async&#39;&#39; (async-suffix)

This rule is designed to enforce function/method names to contain an 'Async' suffix if they refer to an `async` function. This rule works in combination with the async-await rule which enforces functions with an 'Async' suffix are called with an `await`.

## Rule Details

Examples of **incorrect** code for this rule:

```js
async function foo() { }
const bar = async function() { }
const baz = async () => { }

class Foo {
    async foo() { }
}

const obj = {
    async foo() {},
    bar: async function() { },
    baz: async () => { },
};

let foo;
foo = async () => {};
```

Additionally the use of an `Async` suffix where no `async` function is defined is also invalid:
```js
function fooAsync() { }
const barAsync = function() { }
const bazAsync = () => { }

class Foo {
       fooAsync() {}
}

const obj = {
   fooAsync() {},
   barAsync: function() {},
   bazAsync: () => { }
};

let fooAsync;
fooAsync = function() { };
```

Examples of **correct** code for this rule:

```js
async function fooAsync() { }
const barAsync = async function() { }
const bazAsync = async () => { }

function foo() { }
const bar = function() { }
const baz = () => { }

class Foo {
   async fooAsync() { }
   foo() {}
}

const obj = {
   async fooAsync() {},
   foo() {},
   barAsync: async function() { },
   bar: function() {},
   bazAsync: async () => { },
   baz: () => { }
};

let fooAsync;
fooAsync = async () => {};
let foo;
foo = function() { };
```

## When Not To Use It

This rule is opinionated, and is essential for this plugin. If you dislike the naming convention then this plugin is not recommended for you.

It should be noted, auto-fix assumes **ALL** rules for this plugin are enabled.

## Further Reading

If there are other links that describe the issue this rule addresses, please include them here in a bulleted list.
