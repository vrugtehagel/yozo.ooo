---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.then()",
	"terms": "flow then callback pipeline fire basic listen attach hook into trigger event",
	"description": "The `flow.then()`{js} method chains a callback onto a flow's pipeline. The callback fires once a trigger reaches it and continues immediately after."
}
---

It is one of the most used methods of the [`Flow`](/docs/flow/) class, integral to working with flows.

## Syntax

```js
flow.then(callback);
```

### Parameters

`callback`{arg}
: The callback to add onto the callback pipeline. It receives the trigger arguments as arguments. In case of event listeners, a single `event`{arg} argument; see [`when()`](/docs/when/).

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

The `.then()`{js} method is one of the most commonly used methods for flows. In many cases, the `.then()`{js} callback is the only one in the flow's pipeline. For more information on how flow pipelines work, see [flows](/docs/flow/).

### Basic usage

Use the `.then()`{js} method to hook into flows triggering. The trigger's arguments are passed to the callback, and the callback's return value is ignored. Most of (if not all) the time, the flows in question are created by other helper functions, such as [`when()`](/docs/when/) (for event listeners), [`when().observes()`](/docs/when/observes/) for observers like `MutationObserver`{js} objects, or timing-related helpers such as [`frame()`](/docs/frame) for framerate callbacks. Use the method like so:

```js
when(button).clicks().then(event => { /* … */ });

const options = { childList: true, subtree: true };
when(document.body).observes('mutation', options)
	.then(records => { /* … */ });

frame().then(() => { /* … */ });
```

### Awaiting flows

The `.then()`{js} method is not only reusing the `promise.then()`{js} method for aesthetic reasons; it also allows us to "await" flows. The `await`{js} keyword calls the `.then()`{js} method of whatever is being awaited (if it has one) and as such allows non-promises to hook into being able to use the `await`{js} keyword. So, instead of complicated juggling between callbacks, promises and flows, we can do things like:

```js
await when(img).loads().once();
```

:::warning
**Warning:** Adding [`.once()`](/docs/flow/once/) to the flow is strongly recommended if we are not re-using the flow for other purposes. In non-monitored contexts, leaving out the `.once()`{js} creates a memory leak. In monitored contexts, it doesn't create a memory per se, but is inefficient regardless.
:::

Awaiting a flow makes some of the flow's other methods shine; e.g. through [`.if()`](/docs/flow/if/), we can filter out some specific triggers, or through [`.after()`](/docs/flow/after/) we can set up single-use event listeners for events that get triggered by another piece of code:

```js
await when(img).loads().once()
	.after(() => img.src = '/cat.jpg');

await when(input).keydowns()
	.if(event => event.key == 'Enter')
	.once();

await when(document).mousemoves()
	.debounce(10_000);
```

We can also utilize the flows returned by many of Yozo's helpers. One straight-forward example of this is `await [timeout(…)](/docs/timeout/)`{js} to wait for a certain amount of time (note that `timeout()`{js} already has `.once()`{js} built-in), but even things like `await [connected()](/docs/components/connected/).once()`{js} are possible.

When using `await`{js} in monitored contexts, make sure to use `until()`{js} to avoid losing monitorability after an awaited statement.

## Usage notes

Unlike the `.then()`{js} method for promises, the return value of the callback passed to `flow.then()`{js} is completely ignored. Given an asynchronous callback that needs to run before continuing the trigger through the pipeline, use [`.await()`](/docs/flow/await/) instead.

## See also

- [`Flow`](/docs/flow/)
- [`when()`](/docs/when/)
- [`flow.once()`](/docs/flow/once/)
- [`flow.await()`](/docs/flow/await/)
- [`until()`](/docs/monitor/until/)
