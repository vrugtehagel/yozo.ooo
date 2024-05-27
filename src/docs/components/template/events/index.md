---
{
	"layout": "layouts/docs.liquid",
	"title": "@event",
	"terms": "event attach listener type add shorthand inline component template bind at",
	"description": "Attach event listeners right inside the component template with @-prefixed attribute names."
}
---

## Syntax

```yz
<element @event="handler"></element>
```

### Parameters

`@event`{attr}
: The event type, as passed to `.addEventListener()`{js}. For example `@click`{attr}, `@focus`{attr} or `@change`{attr}.

`handler`{js}
: A block of JavaScript, to be executed when the event fires. This may include not only expressions, but also statements such as `if`{js} statements and `for`{js} loops. It is treated as a regular (non-asynchronous) function body. Inside the function body, the `event`{arg} parameter is made available. The `this`{js} value inside the handler resolves to the element the handler was attached to.

## Details

Like other in-template shorthands, the `@event`{attr} syntax removes any listeners when the component is disconnected from the DOM. Upon reconnecting, listeners are re-attached. The event `handler`{js}, i.e. the function body, does not run in a [monitored](/docs/monitor/) context.

## Examples

### Spoilers

Let's create a custom element for spoilers. It will be an inline element, rendering its contents inside a `<span>`{yz} in its shadow root. By default, the span hides the content and shows a black bar. When clicked, the contents are revealed.

```yz
<title>spoiler-text</title>
<template mode="closed">
	<span
		@click="$.revealed = true"
		:class+revealed="$.revealed"
	>
		<slot></slot>
	</span>
</template>
<style>
span:not(.revealed) {
	background: black;
	slot { visibility: hidden; }
}
</style>
```

Theoretically, we can optimize this by removing the event listener after it has run once, since users can't un-reveal the spoiler. In cases like such, where event listeners need to be configured in a more granular or specific way, write them out explicitly using [`connected()`](/docs/components/connected/) and [`when()`](/docs/when/).

### List items

For a more complex example, let's write a component that includes a text input, and lets the user enter lines of text. When they press `Enter`{str}, the input is cleared and the text is inserted into a `<pre>`{yz} element. We can do this using a `@keydown`{attr} expression with an `if()`{js} statement inside:

```yz
<title>list-items</title>
<template mode="closed" delegates-focus="true">
	<input
		type="text"
		@keydown="if (event.key == 'Enter') {
			$.$lines.unshift(this.value);
			this.value = '';
		}"
	>
	<pre>{{ $.lines.join('\n') }}</pre>
</template>
<script>
$.lines = [];
</script>
```

While it is not recommended to write full function bodies inline in the `<template>`{yz}, it is certainly possible and the example demonstrates both usage of the `event`{arg} argument as well as the `this`{js} value (which resolves to the `<input>`{yz} here).

## See also

- [`when()`](/docs/when/)
- [`connected()`](/docs/components/connected/)
- [`:attribute`](/docs/components/template/attribute/)
- [`<template>`](/docs/components/template/)
- [`components`](/docs/components/)
