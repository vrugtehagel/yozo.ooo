---
{
	"title": "purify()",
	"terms": "purify undo pure side effect context when listener",
	"description": "Remove side effects of previous calls for a certain function with `purify()`{js}. This, in a way, can make functions with side effects \"pure functions\"."
}
---

## Syntax

```js
purify(callback);
```

### Parameters

`callback`{arg}
: A function (possibly `async`{js}) to purify. It introduces a new [monitored](/docs/monitor/) context of [type "undo"](/docs/monitor/undo/) for every call of the function, to run the callback in. Upon each call, the previous call is undone, leaving no trace of listeners, observers, or other [`Flow`](/docs/flow/)-based operations.

### Return value

A function, the purified version of the `callback`{arg} that was passed. The arguments are passed on to the callback, and the return value is passed on back. Additionally, the `this`{js} value is passed on to the callback as well. When using an `async`{js} callback, make sure to use [`until()`](/docs/monitor/until/) for awaited expressions.

## Examples

### Toast messages

Let's say we're in a situation where a user may click on a button, an we want to provide some feedback in the form of a toast message (such as a simple "Saved" message). Given that we need the toast message to be removed after a certain delay, a naive approach to this problem could be

```js
const toast = document.querySelector('#toast');
const showToast = async () => {
	document.body.append(toast);
	await timeout(7000);
	toast.remove();
};
```

Here, we're using [`timeout()`](/docs/timeout/) to create a 7-second delay. At first glance, this seems to work. However, when doing more thorough testing, we'll find a bug; if the user clicks once, then again after 6 seconds, then the toast message gets removed only one second after the second click. What should happen is that the `timeout()`{js} restarts from the beginning, so that the toast message always takes 7 seconds to disappear after the last time the user clicked the button.

The solution is to cancel the previous `timeout()`{js} call when the `showToast()`{js} function is called again before the previous timeout has finished. The `purify()`{js} function exists for this goal specifically:

```js
const toast = document.querySelector('#toast');
const showToast = purify(async () => {
	document.body.append(toast);
	await until(timeout(7000));
	toast.remove();
});
```

Note that we'll also want to add [`until()`](/docs/monitor/until/) to the `await`{js} expression, to make sure the monitored context can pick back up where it left off.

Now, when repeatedly calling the `showToast()`{js} function, the `timeout()`{js} calls are properly cleaned up, causing the message to always be removed with a 7 second delay after the function was called.

## Usage notes

The [`effect()`](/docs/effect/) helper also cleans up monitored contexts of [type "undo"](/docs/monitor/undo/), but additionally tracks live variables. When nesting a `purify()`{js} call inside an `effect()`{js}, be aware that the monitored contexts do not nest. The outer `effect()`{js} call is therefore unable to "see" any of the monitorables, including live variables, inside the purified function.

## See also

- [`Flow`](/docs/flow/)
- [`monitor()`](/docs/monitor/)
- [Monitoring "undo"](/docs/monitor/undo/)
- [`when()`](/docs/when/)
- [`timeout()`](/docs/timeout/)
- [`effect()`](/docs/effect/)
