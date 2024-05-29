---
{
	"layout": "layouts/docs.liquid",
	"title": "disconnected()",
	"terms": "disconnected callback lifecycle hook component disconnects destroy unmount",
	"description": "To explicitly run a callback when a component disconnects from the DOM, use the `disconnected()`{js} lifecycle callback."
}
---

:::info
**Note:** The [`connected()`](/docs/components/connected/) lifecycle callback already takes down event listeners and other [`Flow`](/docs/flow/) objects when a component disconnects from the DOM. The `disconnected()`{js} callback should not be used in these cases; it is intended only for explicit side effect of disconnecting a custom element.
:::

## Syntax

```js
disconnected();
disconnected(callback);
```

### Parameters

`callback`{arg} <mark>optional</mark>
: An optional callback to run when the component disconnected (i.e. is removed) from the DOM. The `callback`{arg} is ran inside a monitored context for [type "undo"](/docs/monitor/undo/), which cleans up the next time the component disconnects (not when the component reconnects).

### Return value

A [`Flow`](/docs/flow/) object that triggers anytime the component disconnects.

## Details

The `disconnected()`{js} lifecycle callback is available anywhere inside the [`<script>`](/docs/components/script/) section of a component definition. The native web component equivalent is the `.disconnectedCallback()`{js} method. However, side effects managed inside the callback are safe from memory leaks; a monitored context is set up for every call, and the previous monitored context is taken down right before a new one is set up. In practice, this means it becomes much easier to set up e.g. event listeners (using [`when()`](/docs/when/)) and other flows because they are automatically taken down.

It can also be utilized purely for its return value, so that it may be passed to [`.until()`](/docs/flow/until/) or used in conjunction with `await`{js}. As such, the `callback`{js} parameter is optional.

## Examples

### whenless listeners

Let's try to write a component with an event listener, without using `when()`{js} (or the inline [`@event`](/docs/components/template/events/) syntax). To do this, we'll use the `connected()`{js} handler, the traditional `.addEventListerner()`{js} call to attach the listener, and then their counterparts `disconnected()`{js} and `.removeEventListener()`{js} to take them back down. This might look something like:

```yz
<title>click-counter</title>
<meta attribute="count" type="number">
<template>
	<button>Clicks: {{ $.count }}</button>
</template>
<script>
const button = query('button');

function increment(){
	$.count += 1;
}

connected(() => {
	button.addEventListener('click', increment);
});

disconnected(() => {
	button.removeEventListener('click', increment);
});
</script>
```

This is, of course, an overly verbose way to do this. [`when()`](/docs/when/) is flow-based, and flows participate in [type "undo"](/docs/monitor/undo/) monitored contexts. In other words; when using `when()`{js} inside a lifecycle callback, then the callback can "see" the listener and take it down when appropriate. Using `.addEventListener()`{js} sidesteps this system, which then means we need to specify the `disconnected()`{js} callback to avoid the listener leaking.

## See also

- [`connected()`](/docs/components/connected/)
- [`Flow`](/docs/flow/)
- [components](/docs/components/)
- [monitoring "undo"](/docs/monitor/undo/)
- [`<meta hook>`](/docs/components/meta/hook/)
