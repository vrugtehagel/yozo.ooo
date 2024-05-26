---
{
	"layout": "layouts/docs.liquid",
	"title": "connected()",
	"terms": "connected callback lifecycle hook component connects setup created",
	"description": "The main lifecycle callback for components is `connected()`{js}. It fires when the component connects to the DOM, and undoes itself when it disconnects."
}
---

## Syntax

```js
connected();
connected(callback);
```

### Parameters

`callback`{arg} <mark>optional</mark>
: A function to run when the component connects to the DOM. A monitored context for [type "undo"](/docs/monitor/undo/) is created for this function to run in, and the context is cleaned up whenever the component disconnects. The `callback`{arg} receives no arguments. The argument may be omitted if the return value is the only thing of interest.

### Return value

A [`Flow`](/docs/flow/) object that triggers whenever the component connects.

## Details

The `connected()`{js} lifecycle callback is the equivalent to the native `connectedCallback()`{js}, though with a major improvement; it creates a [monitored](/docs/monitor/) context. In practice, this means that things like event listeners (using [`when()`](/docs/when/)) or [effects](/docs/effect/) are cleaned up when the component disconnects, removing the need for the author to manually do this kind of boilerplate bookkeeping. While generally the `connected()`{js} callback is used in the top-level of the [`<script>`](/docs/components/script/) section, this is not at all required. Since the callback is powered by (and returns) a `Flow`{js} object, it can itself be safely used inside other monitored contexts, such as inside an `effect()`{js}. If `connected()` is called while the component is already connected, the `callback`{arg} fires once semi-immediately (specifically it runs after a single microtask).

For most rendering-related things, the `connected()`{js} callback should be used in order to increase performance. It should be the preferred way to set up template-related event listeners, observers and effects, since these things don't need to be run while components are not connected to the DOM (since they cannot be interacted with).

## Examples

### Color swatch

Let's create a component that renders a color swatch before a certain color. For the sake of progressive enhancement, the element takes no attributes but instead reads the color from the text inside. For example, we'd use it as

```html
<color-swatch>#8BE9FD</color-swatch>
```

We do this so that the custom element is not technically necessary for the user to consume the content, whereas if we chose to go with an attribute, the component needs to load before the user can even see the hex representation of the color.

The way we'll implement this is as follows. We'll set up a basic template that renders the swatch, and a `<slot>`{yz} to render the textual representation. We'll then use [`when().observes()`](/docs/when/observes/) along with [`live.link()`](/docs/live/link/) to keep track of the text content, and finally a single [`effect()`](/docs/effect/) to pass our color to a CSS variable. We'll do both of these inside a `connected()`{js} callback, because neither really is useful when the component isn't visible.

```yz
<title>color-swatch</title>
<template mode="closed">
	<span id="swatch"></span>
	<slot></slot>
</template>
<script>
const swatch = query('#swatch');

connected(() => {
	live.link($.$content, {
		get: () => this.textContent,
		changes: when(this).observes('mutation', {
			childList: true,
			characterData: true,
			subtree: true
		})
	})

	effect(() => {
		swatch.style.setProperty('--color', $.content);
	});
});
</script>
<style>
#swatch {
	display: inline-block;
	width: 1em;
	height: 1em;
	box-sizing: border-box;
	background-color: var(--color, black);
	border: medium solid white;
}
</style>
```

The component now does no work whatsoever when it is disconnected from the DOM, which results in better performance overall. We could also write the `live.link()`{js} and `effect()`{js} in their own separate `connected()`{js} call; it is functionally equivalent, so this is completely up to preference.

### Deferred setup logic

If a component instance needs to do heavy setup logic, it could be desirable to defer this logic to when the component actually connects to the document. Since `connected()`{js} returns a `Flow`{js} object, we can use methods such as `.once()`{js} like on any other flow.

```yz
<title>heavy-setup</title>
<template mode="closed">
	<div #if="!$.loaded">loading…</div>
	<div #else>
		{{ $.result }}
	</div>
</template>
<script>
connected(() => {
	$.result = heavyOperation();
}).once();
</script>
```

This causes the `heavyOperation()`{js} to only be executed once per instance, and only if the component is used. An alternative is to combine [`.until()`](/docs/flow/until/) and the [`disconnected()`](/docs/components/disconnected/) lifecycle callback to get `.until(disconnected())`{js}. This behaves similar to `.once()`{js}, but differs in when the monitored context is undone. When using `.once()`{js}, the context is undone immediately after firing, so any event listeners or other flows set up are stopped immediately. With `.until(disconnected())`{js}, the monitored context is not undone until the component disonnects. In practice, that means the component behaves a little different the first time it connects to the DOM.

## See also

- [components](/docs/components/)
- [`Flow`](/docs/flow/)
- [monitoring "undo"](/docs/monitor/undo/)
- [`disconnected()`](/docs/components/disconnected/)
- [`<meta hook>`](/docs/components/meta/hook/)
