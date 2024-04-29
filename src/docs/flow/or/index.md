---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.or()",
	"description": "Using `flow.or()`{js}, two or more flow objects can be combined into one. The callback pipeline then receives triggers from all included flows."
}
---

## Syntax

```js
flow.or(thenable);
```

### Parameters

`thenable`{arg}
: A thenable (such as another [`Flow`](/docs/flow/) or a `Promise`{js}) whose trigger is to be included in `flow`{js}'s callback pipeline. Upon stopping `flow`{js}, the `thenable`{arg}'s `.stop()`{js} method is called (if it exists), allowing all relevant flows to be cleaned up properly.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

### Timeouts

The `.or()`{js} method can be beautifully combined with [`timeout()`](/docs/timeout/) to create timeouts for certain events. For example, say we have a toast popup that we need to close when either the user clicks it or when it's been shown for 5 seconds. We might do something like

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

We combine it with [`purify`](/docs/purify/) to allow the `.show()`{js} method from cleaning up the listener and timeout created in a previous call, which allows us to call it multiple times in succession safely. The resulting custom element toggles the `hidden`{attr} attribute off when the `.show()`{js} method is called, and adds the attribute back when either the message is clicked or the specified `timeout()`{js} elapses.

## Usage notes

When calling `flow.or(other)`{js}, the argument `other`{js} is bundled into `flow`{js}, but not the other way around; the `other`{js} flow isn't aware of this. As such, stopping the `other`{js} does _not_ stop `flow`{js}, it simply prevents the `other`{js} from sending any more triggers into `flow`{js}'s callback pipeline.

## See also

- [`Flow`](/docs/flow/)
- [`when()`](/docs/when/)
- [`timeout()`](/docs/interval/)
- [`purify()`](/docs/purify/)
