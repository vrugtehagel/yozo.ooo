---
{
	"layout": "layouts/docs.liquid",
	"title": "Flow constructor",
	"description": "The flow constructor is a low-level feature, allowing flows to be used beyond the helpers Yozo offers."
}
---

:::warning
**Warning:** This is a low-level API. It is prone to creating memory leaks if not used with care. For general use, see the [flows](/docs/flow/) page, which covers Yozo's helper functions for common use cases such as event listeners, observers, and timers.
:::

## Syntax

```js
new Flow(callback);
```

### Parameters

`arg`callback``
: A function to be executed synchronously by the constructor. It receives a single argument; a `js`trigger`` function. This is similar to the `js`resolve`` argument in a callback to a `js`Promise`` constructor, except `js`trigger`` may be called any number of times, each call triggering the flow.

### Return value

A new [`Flow`](/docs/flow/) object. It triggers whenever the `js`trigger`` function given to the `arg`callback`` is called, or when the flow is manually triggered using [`flow.now()`](/docs/flow/now/).

## Examples

### Yozo's interval()

Yozo provides the helper function [`interval()`](/docs/interval/), which is essentially a flowified version of `js`setInterval()``. Here's how it is implemented.

The first step is to create a flow that triggers with the interval. That part is relatively simple:

```js
function interval(duration){
	return new Flow(trigger => {
		setInterval(trigger, duration);
	});
}
```

However, this by itself has a big lurking issue; the interval never stops. You can call [`flow.stop()`](/docs/flow/stop/) on the flow, but the `js`setInterval()`` will keep going.

:::info
**Note:** When using the development bundle for Yozo, there is a warning to prevent this kind of issue. Specifically, it will throw a warning whenever a flow was stopped, but the `js`trigger`` function given in the constructor is being called.
:::

To fix this issue, we will need to add a proper [`flow.cleanup()`](/docs/flow/cleanup/) handler:

```js
function interval(duration){
	let id;
	return new Flow(trigger => {
		id = setInterval(trigger, duration);
	}).cleanup(() => {
		clearInterval(id);
	});
}
```

Now, we can use the interval function safely, and not only is it cancelable by calling `js`flow.stop()``, it also automatically participates in monitored contexts. For example, when using it inside a [`connected()`](/docs/components/connected/) hook, it will cancel and clean up the `js`setInterval()`` whenever the component disconnects.

### Deno's watchFs

Originally, the local development server for this site used an async iterator from [Deno](https://deno.com/) to watch the file system for changes. To make it easier to throttle the amount of times the build script runs, and to end the serving after some amount of inactivity, a flow was used to wrap the file watcher. Specifically, we can write a wrapper for the [`Deno.FsWatcher`](https://deno.land/api?s=Deno.FsWatcher) async iterator. Initially, to create the flow, we can simply do

```js
const watcher = Deno.watchFs(['src']);
const flow = new Flow(async trigger => {
	for await (const change of watcher) {
		trigger(change);
	}
});
```

This flow will now trigger whenever the watcher yields another change. However, and this is where manually creating flows gets a little sensitive; calling `js`.stop()`` on the flow does _not_ automatically cancel the watcher. To do so, we'll need to clean up after ourselves:

```js
flow.cleanup(() => {
	watcher.close();
});
```

Now, our flow is safe, and we can easily throttle the changes to acceptable levels. Additionally, we can add a debounce to detect inactivity:

```js
flow.throttle(1000)
	.then(() => build())
	.debounce(3_600_000)
	.once();
```

To stop the watcher manually, we can simply call `js`flow.stop()``; alternatively, due to the `js`.debounce()`` method combined with `js`.once()``, the watcher automatically stops after `js`3_600_000`` milliseconds (one hour).

## Usage notes

All flows automatically participate in monitored contexts of [type "undo"](/docs/monitor/undo/). The monitoring is done synchronously inside the constructor, so to prevent monitoring, ignore the constructor itself using [`monitor.ignore()`](/docs/monitor/ignore/):

```js
const flow = monitor.ignore(() => {
	return new Flow(trigger => { /* … */ });
});
```

## See also

- [`Flow`](/docs/flow/)
