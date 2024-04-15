---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.stop()",
	"description": "The `js`flow.stop()`` method stops a flow immediately. Its cleanup callbacks are run, and the flow is prevented from ever triggering again."
}
---

This method does not interact with the flow pipeline; when called, it stops the flow immediately. After calling it once, doing so again has no effect.

## Syntax

```js
flow.stop();
```

### Parameters

None.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

## Examples

### Stop auto-registration

It is possible to automatically discover and register custom elements on the page with [`register.auto()`](/docs/register/auto/). This method returns a `js`Flow``, which can be stopped to avoid further continuous scanning of a document. Although we can use `js`.until()`` for this purpose, we may also store a reference to the flow and use it to manually call `js`.stop()`` on it later, like so:

```js
const autoRegistrationFlow = register.auto(name => {
	const url = resolveComponentURL(name);
	return url;
});

// Later…
autoRegistrationFlow.stop();
```

## Usage notes

Once a flow has been stopped, all references to pipeline callbacks are removed, and no more can be added. Additionally, cleanup callbacks are run synchronously as soon as a flow stops. When a cleanup callback is added after a flow has been stopped, that cleanup callback fires immediately.

A stopped flow is essentially useless, because it can no longer trigger; not even by manually calling [`flow.now()`](/docs/flow/now/). As such, it is not advised to retain references to flows after they have been stopped.


## See also

- [`flow.until()`](/docs/flow/until/)
- [`flow.once()`](/docs/flow/once/)
