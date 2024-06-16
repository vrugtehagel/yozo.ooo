---
{
	"title": "Monitoring \"undo\"",
	"terms": "monitoring undo type callback cleanup flow when",
	"description": "Under the hood, things that benefit from cleanup callbacks (such as `Flow`{js} objects) use this type to specify how to be undone."
}
---

It is not generally to be used explicitly, but understanding it may help with understanding how flows (including helpers such as [`when()`](/docs/when/)) interact with contexts that monitor for the `'undo'`{js} type, such as [`connected()`](/docs/components/connected/) or [`effect()`](/docs/effect/).

## Details

The `'undo'`{js} type expects a single argument for its [`monitor.add()`](/docs/monitor/add/) call; a function. All functions added to the monitored context are then bundled into a single function under the `.undo()`{js} key on the object returned by [`monitor()`](/docs/monitor/). When that function is called, all individually added functions are run (in the same order they were added in), references to them are cleaned up, and any [`until()`](/docs/monitor/until/) expressions are prevented from resolving.

The `'undo'`{js} type is currently automatically added for each [`Flow`](/docs/flow/), and it is used internally for [`<template>`](/docs/components/template/)-related operations, such as caching DOM elements in a [`#for…of`](/docs/components/template/for-of/) loop.

Calling the `.undo()`{js} function on the object returned by `monitor()`{js} multiple times has no effect beyond the first call.

While extremely unlikely, if another cleanup callback is added to a context that has already called its `.undo()`{js} function, the callback is fired immediately (and no references to it are stored). Adding the same function reference multiple times using `monitor.add()`{js} causes it to be run multiple times.

## Examples

### Deep dive

Monitoring cleanup callbacks is vital for things like the [`connected()`](/docs/components/connected/) lifecycle callback. One of the main administrative painpoints of writing custom elements manually is that the author needs to keep references to all event listeners, and disconnect them in the native `disconnectedCallback()`{js} callback. The monitoring system with its `'undo'`{js} type makes it possible for `connected()`{js} to "see" cleanup callbacks, making it completely unnecessary for the author to keep references around manually.

To demonstrate how this happens, let's strip away [`when()`](/docs/when/) and even [`Flow`](/docs/flow/) objects. We'll create our own monitored context, set up a listener inside it, and make sure to define its cleanup handler.

```js
const button = document.querySelector('button');
const onclick = () => console.log('click!');

const call = monitor(['undo'], () => {
	button.addEventListener('click', onclick);
	monitor.add('undo', () => {
		button.removeEventListener('click', onclick);
	});
});

// later…

call.undo();
```

The `monitor()`{js} call runs its callback and sets up the event lister. The returned `call`{js} object now holds the key to cleaning up this event handler, under its `.undo()`{js} property. The main advantages of this design is that, first, undo handlers may be defined right next to their setup code, and therefore even abstracted away into a helper function (such as `when()`{js}). Second, it is much easier to hand control of actually running the cleanup handlers over to another piece of code; of course, notably, to Yozo itself.

### Deeper dive

The previous example handled a synchronous function. However, `monitor()`{js} supports `async`{js} functions too (in combination with [`until()`](/docs/monitor/until/)). This complicates how monitor collects items, but luckily this is relatively straight-forward when it comes to `'undo'` (less so for [`'live'`](/docs/monitor/live/). Cleanup callbacks are collected for as long as the context exists, and hasn't been undone yet. When undoing a call, it is assumed that the function should effectively stop running, and therefore, `until()`{js} short-circuits out of calls. Let's repeat the previous example, but introduce a one second delay inside monitored function.

```js
const button = document.querySelector('button');
const onclick = () => console.log('click!');

const call = monitor(['undo'], async () => {
	await until(timeout(1000));

	button.addEventListener('click', onclick);
	monitor.add('undo', () => {
		button.removeEventListener('click', onclick);
	});
});
```

Now, the monitored context is immediately paused, until the `timeout()`{js} resolves. Regardless of whether or not the delay has completed or not, the `call.undo()`{js} function exists right away. If we wait for the delay to pass, then `call.undo()`{js} works just like it did in the previous example. If we on the other hand don't wait for the delay, and call `call.undo()`{js} before it runs out, then `until()`{js} simply never resolves and is garbage collected. In other words, the code setting up the event listener, as well as the code defining its cleanup, is never even reached.

### Deepest dive

For the last example, we'll have a look at some code crafted specifically to add another callback to the monitored context, after it has been undone. In general, this very rarely happens, because (as discussed in the previous example) `until()`{js}, which needs to be used to resume the monitored context, stops subsequent code from executing if the context's `.undo()`{js} has been called. However, it is possible:

```js
const button = document.querySelector('button');
const onclick = () => console.log('click!');

const call = monitor(['undo'], async () => {
	await until(timeout(1000));

	call.undo();

	button.addEventListener('click', onclick);
	monitor.add('undo', () => {
		button.removeEventListener('click', onclick);
	});
});
```

This code is identical to the previous example, except here we undo the context immediately when it it has been resumed after the one second delay. However, since the event listener is set up synchronously, there's no `until()`{js} to prevent the code after the `call.undo()`{js} from being run. Instead, the event listener is set up, and the `monitor.add()`{js} call is run. However, since the context has been undone already, the cleanup callback passed to `monitor.add()`{js} is immediately run.

## See also

- [`until()`](/docs/monitor/until/)
- [`when()`](/docs/when/)
- [`Flow`](/docs/flow/)
- [`monitor.add()`](/docs/monitor/add/)
- [`monitor()`](/docs/monitor/)
- [`monitor.register()`](/docs/monitor/register/)
