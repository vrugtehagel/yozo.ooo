---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.cleanup()",
	"description": "Add cleanup handlers using `.cleanup()`{js}, to be run when a flow is stopped. It is mostly intended for when manually creating `Flow`{js} objects."
}
---

## Syntax

```js
flow.cleanup(callback);
```

### Parameters

`callback`{arg}
: A function to be run when the flow is stopped. It receives no arguments.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Details

When the flow in question stops (through e.g. [`.until()`](/docs/flow/until/), [`.stop()`](/docs/flow/stop/), [`.once()`](/docs/flow/once/) or otherwise), the cleanup callbacks are fired in same order as they were attached. If the same function reference is passed to multiple `.cleanup()`{js} calls, then they are called multiple times.

## Examples

### Media query flow

Let's build a function that turns the native `matchMedia()`{js} into a [`Flow`](/docs/flow/) object. We'll pass the function a media query as a string (such as `'(width < 800px)'`{js}), and the returned flow triggers whenever the media query changes state, i.e. activates or deactivates. This needs to be read with an event listener, for which we could use [`when()`](/docs/when/), but let's refrain from doing so for the sake of the example.

```js
function mediaQuery(query){
	const controller = new AbortController();
	const { signal } = controller;
	const mediaQueryList = window.matchMedia(query);
	return new Flow(trigger => {
		mediaQueryList.addEventListener('change', () => {
			trigger(mediaQueryList.matches);
		}, { signal });
	}).cleanup(() => {
		controller.abort();
	});
}
```

Here we use an `AbortController`{js} with its `AbortSignal`{js} to remove the event listener inside the `.cleanup()`{js} method. This makes sure that whenever the flow is stopped (for any reason) then we're not creating a memory leak by having a stopped flow continuing to attempt to trigger.

## Usage notes

The `.cleanup()`{js} method is relatively low-level, and mostly useful when manually creating flows. When creating a flow inside a monitored context of [type "undo"](/docs/monitor/undo/), then a `.cleanup()`{js} method is equivalent to a `monitor.add('undo', …)`{js} call.

## See also

- [`Flow`](/docs/flow/)
- [`flow.stop()`](/docs/flow/stop/)
- [`flow.until()`](/docs/flow/until/)
- [`flow.once()`](/docs/flow/once/)
- [`monitor()`](/docs/monitor/)
- [monitoring "undo"](/docs/monitor/undo/)
