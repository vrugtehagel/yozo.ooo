---
{
	"layout": "layouts/docs.liquid",
	"title": "until()",
	"description": "Use `js`until()`` in conjunction with `js`await`` to maintain the monitored context in asynchronous monitored functions."
}
---

To learn more about monitored contexts, see [`monitor()`](/docs/monitor/).

## Syntax

```js
await until(thing);
until(thing).then(() => { /* … */ });
```

### Parameters

`arg`thing``
: Usually, a `js`Promise`` to await, but any value is accepted.

### Return value

The `js`until()`` method returns a `js`Promise``; it resolves to the same value as `arg`thing``. If the promise rejects, then the monitored context is not resumed; if this is a possibility, use a `js`.catch()`` handler inside the `js`until()`` call (like `js`until(thing.catch(…))``).

:::warning
**Warning:** The `js`.then()`` handler on the returned promise must be called immediately (which includes using `js`until()`` together with `js`await``). This is because the monitored context is only temporarily restored exactly when the promise resolves; anything after that is too late.
:::

## Examples

### Using fetch()

In this example, we'll set up an effect that first makes a request using `js`fetch()``, and subsequently condintionally attaches a click handler. The code might look something like

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

Here, we need to wait for a request to finish before deciding whether or not to attach the click handler. Without `js`until()``, the asynchronicity would cause the monitored context to be lost. To fix this, we add `js`until()`` around the whole thing that we're awaiting (both around the `js`fetch(…)`` and the `js`response.json()`` call). This allows us to pick the monitored context back up after the `js`await``.

:::info
**Note:** While using `js`until()`` is technically unnecessary if the code following it do not add anything to the monitored context, it is good practice to use `js`until()`` when using `js`await`` in monitored contexts to avoid bugs that may unexpectedly occur when altering such a piece of code in the future.
:::

Now, a question one might have is; what if we change `js`$.inputValue`` twice in quick succession, so that the first fetch call has not yet completed when the effect re-runs? Well, `js`until()`` is smart about this; if it notices that a monitored context has been cleaned up when its argument finally resolves, it then won't resolve the returned promise. In practice, that means the function just "stops" at that point. The never-settling promise will then be garbage collected and removed.

### Awaiting when()

One of the benefits of using [`when()`](/docs/when/) is its ease of use with `js`await``. This also means that, if we wish to use that, then in monitored contexts we need `js`until()``. For example, say we have a library of photos. We let the user enter a name, and then retrieve a photo by that name. Then, they can click on the photo to download it. Here's what an effect could look like that achieves this:

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

Without `js`until()``, this example would create a memory leak; specifically, the click handlers would add up over time, since they are never cleaned up. With `js`until()``, the monitored context is resumed after the `js`await`` expression, and thus the `js`when()`` call adds its cleanup callbacks to the monitored context.

## See also

- [`monitor()`](/docs/monitor/)
- [`when()`](/docs/when/)
- [`timeout()`](/docs/when/)
