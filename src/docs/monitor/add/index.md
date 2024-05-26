---
{
	"layout": "layouts/docs.liquid",
	"title": "monitor.add()",
	"terms": "monitor add context include item manual",
	"description": "Using `monitor.add()`{js}, specific items of any type may manually be added to the monitored context."
}
---

:::warning
**Warning:** This is a low-level API. Yozo takes care of adding the correct items to the monitored contexts in most cases. Overusing this API may lead to hard-to-debug errors.
:::

## Syntax

```js
monitor.add(type, ...things);
```

### Parameters

`type`{arg}
: A registered monitorable type. By default, either [`'undo'`](/docs/monitor/undo/) or [`'live'`](/docs/monitor/live/).

`...things`{arg}
: The items to add to the monitored context. The `type`{arg} determines what type of data should be passed; for `'undo'`{js}, a single callback function should be provided. For `'live'`{js}, two additional arguments are expected; a [live](/docs/live/) variable and an event type to listen for.

### Return value

None (`undefined`{js}).

## Details

If a [monitored context](/docs/monitor/) exists, and the provided type exists, then the item or items are added to the context. If a context or the type does not exist, then nothing happens. In other words; it is safe to call even if a monitored context is not guaranteed.

Calls to `monitor.add()`{js} within [`monitor.ignore()`](/docs/monitor/ignore/) calls are ignored.

## Examples

### Fetch request

When using `fetch()`{js} inside an [`effect`](/docs/effect/), it may be desirable to abort the request if it hasn't finished before the effect is re-run. To do so, we may use `monitor.add()`{js} to add a cleanup callback to the monitored context.

```js
effect(() => {
	const controller = new AbortController();
	const { signal } = controller;
	monitor.add('undo', () => controller.abort());
	const response = await until(fetch('/resource.json', { signal }));
	// do things with the response…
});
```

While this is a quick way to resolve the issue of overlapping requests, note that we don't actually need it for a case like this. Specifically, [`until()`](/docs/monitor/until/) does an "early return" of sorts when the context is undone before its argument has resolved. If we really need this type of functionality, then we may avoid using `monitor.add()`{js} altogether by using a [`Flow`](/docs/flow/), which have a more fleshed out API for adding cleanup callbacks. It allows us to create more readable and reusable code.

```js
function monitorableFetch(url, options){
	const controller = new AbortController();
	const { signal } = controller;
	return new Flow(trigger => {
		fetch(url, { ...options, signal }).then(trigger);
	}).cleanup(() => {
		controller.abort();
	}).once();
}

effect(() => {
	const response = await until(monitorableFetch('/resource.json'));
	// do things with the response…
});
```

Not only does this avoid `monitor.add()`{js}, but creating a flow allows for methods such as [`.stop()`](/docs/flow/stop/), [`.until()`](/docs/flow/until/), or [`.or()`](/docs/flow/or/) which allows for much simpler expressions regarding fetching later on. For example, we might then create a timeout for a fetch request using

```js
await monitorableFetch('/heavy_operation').until(timeout(5000));
```

In short, it is best to avoid `monitor.add()`{js} simply because it is a lower-level API that is better off abstracted away (which Yozo has already done itself).

## See also

- [`monitor()`](/docs/monitor/)
- [monitoring type "undo"](/docs/monitor/undo/)
- [flows](/docs/flow/)
- [`new Flow()`](/docs/flow/constructor/)
- [monitoring type "live"](/docs/monitor/live/)
- [`live()`](/docs/live/)
- [`effect()`](/docs/effect/)
- [`monitor.register()`](/docs/monitor/register/)
