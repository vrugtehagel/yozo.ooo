---
{
	"title": "until()",
	"terms": "until async resume monitor context promise await catch then fetch load when timeout",
	"description": "Use `until()`{js} in conjunction with `await`{js} to maintain the monitored context in asynchronous monitored functions."
}
---

To learn more about monitored contexts, see [`monitor()`](/docs/monitor/).

## Syntax

```js
await until(thing);
until(thing).then(() => { /* … */ });
```

### Parameters

`thing`{arg}
: Usually, a `Promise`{js} or [`Flow`](/docs/flow/) to await, but any value is accepted.

### Return value

The `until()`{js} method returns a `Promise`{js}; it resolves to the same value as `thing`{arg}. If the promise rejects, then the monitored context is not resumed; if this is a possibility, use a `.catch()`{js} handler inside the `until()`{js} call (like `until(thing.catch(…))`{js}).

:::warning
**Warning:** The `.then()`{js} handler on the returned promise must be called immediately (which includes using `until()`{js} together with `await`{js}). This is because the monitored context is only temporarily restored exactly when the promise resolves; anything after that is too late.
:::

## Examples

### Using fetch()

In this example, we'll set up an effect that first makes a request using `fetch()`{js}, and subsequently condintionally attaches a click handler. The code might look something like

```js
effect(async () => {
	const username = $.inputValue;
	const url = new URL('https://example.com/check_name');
	url.searchParams.set('username', username);
	const response = await until(fetch(url));
	const json = await until(response.json());
	if(!json.isAvailable) return;
	when(confirmButton).clicks().then(() => {
		$.confirmUsername(username);
	});
});
```

Here, we need to wait for a request to finish before deciding whether or not to attach the click handler. Without `until()`{js}, the asynchronicity would cause the monitored context to be lost. To fix this, we add `until()`{js} around the whole thing that we're awaiting (both around the `fetch(…)`{js} and the `response.json()`{js} call). This allows us to pick the monitored context back up after the `await`{js}.

:::info
**Note:** While using `until()`{js} is technically unnecessary if the code following it do not add anything to the monitored context, it is good practice to use `until()`{js} when using `await`{js} in monitored contexts to avoid bugs that may unexpectedly occur when altering such a piece of code in the future.
:::

Now, a question one might have is; what if we change `$.inputValue`{js} twice in quick succession, so that the first fetch call has not yet completed when the effect re-runs? Well, `until()`{js} is smart about this; if it notices that a monitored context has been cleaned up when its argument finally resolves, it then won't resolve the returned promise. In practice, that means the function just "stops" at that point. The never-settling promise will then be garbage collected and removed.

### Awaiting when()

One of the benefits of using [`when()`](/docs/when/) is its ease of use with `await`{js}. This also means that, if we wish to use that, then in monitored contexts we need `until()`{js}. For example, say we have a library of photos. We let the user enter a name, and then retrieve a photo by that name. Then, they can click on the photo to download it. Here's what an effect could look like that achieves this:

```js
effect(() => {
	const name = $.photoName;
	await until(
		when(img).loads().once().after(() => img.src = name)
	);
	when(img).clicks().then(() => {
		$.download(name);
	});
});
```

Without `until()`{js}, this example would create a memory leak; specifically, the click handlers would add up over time, since they are never cleaned up. With `until()`{js}, the monitored context is resumed after the `await`{js} expression, and thus the `when()`{js} call adds its cleanup callbacks to the monitored context.

## See also

- [`monitor()`](/docs/monitor/)
- [`when()`](/docs/when/)
- [`timeout()`](/docs/when/)
