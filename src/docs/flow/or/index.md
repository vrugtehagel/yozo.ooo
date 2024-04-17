---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.or()",
	"description": "Using `js`flow.or()``, two or more flow objects can be combined into one. The callback pipeline then receives triggers from all included flows."
}
---

## Syntax

```js
flow.or(thenable);
```

### Parameters

`arg`thenable``
: A thenable (such as another [`Flow`](/docs/flow/) or a `js`Promise``) whose trigger is to be included in `js`flow``'s callback pipeline. Upon stopping `js`flow``, the `arg`thenable``'s `js`.stop()`` method is called (if it exists), allowing all relevant flows to be cleaned up properly.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

### Timeouts

The `js`.or()`` method can be beautifully combined with [`timeout()`](/docs/timeout/) to create timeouts for certain events. For example, say we have a toast popup that we need to close when either the user clicks it or when it's been shown for 5 seconds. We might do something like

```yz
<title>toast-popup</title>
<meta method="show">
<template mode="closed">
	<div id="message" .hidden="!$.shown">
		<slot></slot>
	</div>
</template>
<script>
$.shown = false;
const message = query('#message');

$.show = purify(() => {
	$.shown = true;
	when(message).clicks().or(timeout(5000))
		.once()
		.then(() => $.shown = false);
});
</script>
```

We combine it with [`purify`](/docs/purify/) to allow the `js`.show()`` method from cleaning up the listener and timeout created in a previous call, which allows us to call it multiple times in succession safely. The resulting custom element toggles the `attr`hidden`` attribute off when the `js`.show()`` method is called, and adds the attribute back when either the message is clicked or the specified `js`timeout()`` elapses.

## Usage notes

When calling `js`flow.or(other)``, the argument `js`other`` is bundled into `js`flow``, but not the other way around; the `js`other`` flow isn't aware of this. As such, stopping the `js`other`` does _not_ stop `js`flow``, it simply prevents the `js`other`` from sending any more triggers into `js`flow``'s callback pipeline.

## See also

- [`Flow`](/docs/flow/)
- [`when()`](/docs/when/)
- [`timeout()`](/docs/interval/)
- [`purify()`](/docs/purify/)
