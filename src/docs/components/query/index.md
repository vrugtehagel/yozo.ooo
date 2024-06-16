---
{
	"title": "query()",
	"terms": "query all selector template shadow root element search",
	"description": "Like `.querySelector()`{js}, the `query()`{js} function finds elements in your component's template."
}
---

## Syntax

```js
query(selector);
query.all(selector);
```

### Parameters

`selector`{arg}
: A string representing a CSS selector, equivalent to what one might pass to `.querySelector()`{js}.

### Return value

In the case of `query()`{js}, either an element, or `null`{js} if no matching element was found. In the case of `query.all()`{js}, an array of matching elements. Note that this slightly deviates from `.querySelectorAll()`{js} in that `query()`{js} returns a "real" array instead of a `NodeList`{js}.

:::info
**Note:** The `query()`{js} function takes either the shadow root as base, or the custom element itself if it does not have a shadow root. This also means that it may match any descendant element, even ones that are descendants but not explicitly written out in the component's [`<template>`](/docs/components/template/) section.
:::

## Examples

### Basic querying

Querying elements inside the template is quite similar to how one might normally query elements on a page. For cases where the element is non-conditional (i.e. it and its anchestors do not have an [`#if`](/docs/components/template/if-else/), `#else-if`{attr}, `#else`{attr}, or [`#for…of`](/docs/components/template/for-of/) attribute), it is often a good idea to query the element at the top-level to avoid unnecessary re-querying. For example:

```yz
<title>popup-window</title>
<template mode="closed">
	<div id="titlebar">
		<button>Resize</button>
		<button>Minimize</button>
		<button>Close</button>
	</div>
	<div id="content">
		<slot></slot>
	</div>
</template>
<script>
const titlebar = query('#titlebar');
const buttons = query.all('#titlebar button');

// …
</script>
```

In above component, we'll have the `titlebar`{js} element and `buttons`{js} ready to use throughout our component logic. This works well because we know these elements exist, and will not change, so early querying is safe and avoids unnecessary work.

### Conditional elements

Contrary to static non-conditional elements, it's never a good idea to query conditional elements in the top-level of your component logic. The elements may be recreated when re-renders occur, so elements that have been queried before may become irrelevant. Holding a reference to them in that case is not only pointless, but also prevents it from being garbage collected. So, for conditional elements, only query them for when you need them, like so:

```yz
<title>act-fast-button</title>
<meta attribute="loading" type="boolean">
<template mode="closed">
	<div #if="$.loading">Loading…</div>
	<button #else>Act fast!</button>
</template>
<script>
connected(() => {
	effect(() => {
		if ($.loading) return;
		const button = query('button');
		when(button).clicks().then(() => {
			// Acting…
		});
	});
});
</script>
```

Inside the effect, we make sure the button was actually rendered, after which we know we can safely query it. In fact, top-level querying simply does not work here; conditional elements do not render until the component is connected, so `query('button')`{js} would return `null`{js} if we run it in the top level of our logic.

Note that this specific example could be much simplified using an [`@click`](/docs/components/template/events/) attribute on the button element, avoiding the need for the `connected()`{js} hook and the `effect()`{js} altogether.

### The shadow itself

The `query()`{js} function takes the shadow root as base for querying, if it has one. However, in some cases, one might need a reference to the shadow root itself. This is outside of the scope of `query()`{js}, and instead the recommended solution is to use the element internals API through [`.attachInternals()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/attachInternals), like so:

```yz
<title>get-shadow</title>
<template mode="closed">
	Hello, unqueryable world…
</template>
<script>
const internals = this.attachInternals();
const { shadowRoot } = internals;
// Do stuff with the shadow…
</script>
```

Alternatively, if the shadow root's mode is `"open"`{str}, then `this.shadowRoot`{js} returns the shadow root. A third method (in case attaching element internals is undesirable) could be to query any element in the shadow root, and retrieving the root node, like `query('*').getRootNode()`{js}. However, the element internals API is the cleanest and therefore recommended solution for getting a reference to a (closed) shadow root.

## Usage notes

The `query()`{js} function is also available inside the template, such as in [`{{ inline }}`](/docs/components/template/inline/) expressions, [`:attribute`](/docs/components/template/attributes/) expressions, or other in-template logic.

For those who prefer their components without shadow roots, keep in mind that `query()`{js} looks inside the entire descendant tree that the custom element in question has; for example, if `<my-foo>`{html} has a shadow-less template, and a shadow-less `<my-bar>`{html} uses the `<my-foo>`{html} element in its template, then querying elements in `my-bar`{tag}'s component logic might end up returning elements in `my-foo`{tag}'s template (since they become descendants of `my-bar`{tag}).
