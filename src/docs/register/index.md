---
{
	"layout": "layouts/docs.liquid",
	"title": "register()",
	"description": "The `js`register()`` function is used to explicitly load Yozo component files by their URL."
}
---

It is, in some ways, similar to a `html`<script src="…">`` or `html`<link href="…">`` for JavaScript and CSS respectively.

## Syntax

```js
register(url);
```

### Parameters

`arg`url``
: A string or `js`URL`` object to a Yozo component file.

### Return value

A `js`Promise`` that resolves whenever the component is defined, akin to `js`customElements.whenDefined(…)``. When the component file contains syntactical errors, the return value is a rejected promise; otherwise, the registration will succeed. If the URL provided was already provided previously, `js`register()`` immediately resolves (regardless of whether or not the first registration succeeded).

:::info
**Note:** It is possible to dynamically register components found on the page or in other components through [`register.auto()`](/docs/register/auto/).
:::

## Examples

### Readability

For better readability, it is advised not to destructure the `js`register()`` function, instead using the full `js`window.yozo.`` prefix, like so:

```js
window.yozo.register('/path/to/component.yz');
```

Additionally, while component files "import" (i.e. implicitly destructure) Yozo's functionality by default, this is not the case for the `js`register()`` function specifically. In practice, this means the prefix (or explicit destructuring) is necessary in all contexts.

### Error handling

There are a few ways errors might occur during component registration. They are caused by syntactical errors in the component definition, including malformed HTML, invalid JavaScript, or a missing [`<title>`](/docs/components/title/) element. If an error is thrown, no custom element is defined, and the promise returned by `js`register()`` is rejected. For example, let's say we have a component file as follows:

```yz
<title>uh-oh</title>
<script>
this is not JavaScript, it's a syntax error!
</script>
```

The above creates an invalid block of JavaScript, which simply cannot be parsed. Thus, if we attempt to register the above, the registration will fail, resulting in a rejected promise that we can catch:

```js
try {
	await window.yozo.register('/components/uh-oh.yz');
} catch (error) {
	console.log(error.message); // "unexpected token"
}
```

We might also verify using `js`customElements.get(…)`` (which is a native web components API) that the element was not defined. For defined elements, it returns the constructor for the registered custom element, and it returns `js`undefined`` otherwise:

```js
console.log(customElements.get('uh-oh')); // undefined
```

## See also

- [`register.auto()`](/docs/register/auto/)
- [components](/docs/components/)
