---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.then()",
	"description": "The `js`flow.then()`` method chains a callback onto a flow's pipeline. The callback fires once a trigger reaches it and continues immediately after."
}
---

It is one of the most used methods of the [`Flow`](/docs/flow/) class, integral to working with flows.

## Syntax

```js
flow.then(callback);
```

### Parameters

`arg`callback``
: The callback to add onto the callback pipeline.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Examples

The `js`.then()`` method is one of the most commonly used methods for flows. In many cases, the `js`.then()`` callback is the only one in the flow's pipeline. For more information on how flow pipelines work, see [flows](/docs/flow/).

### Basic usage

Use the `js`.then()`` method to hook into flows triggering. The trigger's arguments are passed to the callback, and the callback's return value is ignored. Most of (if not all) the time, the flows in question are created by other helper functions, such as [`when()`](/docs/when/) (for event listeners), [`when().observes()`](/docs/when/observes/) for observers like `js`MutationObserver`` objects, or timing-related helpers such as [`frame()`](/docs/frame) for framerate callbacks. Use the method like so:

```js
when(button).clicks().then(event => { /* … */ });

const options = { childList: true, subtree: true };
when(document.body).observes('mutation', options)
	.then(records => { /* … */ });

frame().then(() => { /* … */ });
```

### Awaiting flows

The `js`.then()`` method is not only reusing the `js`promise.then()`` method for aesthetic reasons; it also allows us to "await" flows. The `js`await`` keyword calls the `js`.then()`` method of whatever is being awaited (if it has one) and as such allows non-promises to hook into being able to use the `js`await`` keyword. So, instead of complicated juggling between callbacks, promises and flows, we can do things like:

```js
await when(img).loads().once();
```

:::warning
**Warning:** Adding [`.once()`](/docs/flow/once/) to the flow is strongly recommended if we are not re-using the flow for other purposes. In non-monitored contexts, leaving out the `js`.once()`` creates a memory leak. In monitored contexts, it doesn't create a memory per se, but is inefficient regardless.
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

We can also utilize the flows returned by many of Yozo's helpers. One straight-forward example of this is `js`await [timeout(…)](/docs/timeout/)`` to wait for a certain amount of time (note that `js`timeout()`` already has `js`.once()`` built-in), but even things like `js`await [connected()](/docs/components/connected/).once()`` are possible.

When using `js`await`` in monitored contexts, make sure to use `js`until()`` to avoid losing monitorability after an awaited statement.

## Usage notes

Unlike the `js`.then()`` method for promises, the return value of the callback passed to `js`flow.then()`` is completely ignored. Given an asynchronous callback that needs to run before continuing the trigger through the pipeline, use [`.await()`](/docs/flow/await/) instead.

## See also

- [`Flow`](/docs/flow/)
- [`when()`](/docs/when/)
- [`flow.once()`](/docs/flow/once/)
- [`flow.await()`](/docs/flow/await/)
- [`until()`](/docs/monitor/until/)
