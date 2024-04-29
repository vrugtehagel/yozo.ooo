---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.stop()",
	"description": "The `flow.stop()`{js} method stops a flow immediately. Its cleanup callbacks are run, and the flow is prevented from ever triggering again."
}
---

This method does not interact with the flow pipeline; when called, it stops the flow immediately. After calling it once, doing so again has no effect.

:::info
**Note:** If a flow is created in a [monitored](/docs/monitor/) context (one monitoring for [type "undo"](/docs/monitor/undo/) then it is not necessary to manually stop a `Flow`{js}; when the context is undone, the flow is stopped automatically.
:::

## Syntax

```js
flow.stop();
```

### Parameters

None.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

## Examples

### Stop a listener

For the sake of the example, let's set up and take down a listener without the usual methods, i.e. without monitored contexts or [`.until()`](/docs/flow/until/). To do so, we'll need to keep a reference to the [`Flow`](/docs/flow/) returned by [`when()`](/docs/when/):

```js
const button = document.querySelector('button');

const listener = when(button).clicks().then(() => {
	// do things…
});
```

Now, with a reference (`listener`{js}) to the `Flow`{js} object for the event listener, we can stop it at any point by calling

```js
listener.stop()
```

If any additional [`.cleanup()`](/docs/flow/cleanup/) callbacks were added, then these are run once we `.stop()`{js} the flow.

## Usage notes

Once a flow has been stopped, all references to pipeline callbacks are removed, and no more can be added. Additionally, cleanup callbacks are run synchronously as soon as a flow stops. When a cleanup callback is added after a flow has been stopped, that cleanup callback fires immediately.

A stopped flow is essentially useless, because it can no longer trigger; not even by manually calling [`flow.now()`](/docs/flow/now/). As such, it is not advised to retain references to flows after they have been stopped.


## See also

- [`Flow`](/docs/flow/)
- [`flow.until()`](/docs/flow/until/)
- [`flow.once()`](/docs/flow/once/)
