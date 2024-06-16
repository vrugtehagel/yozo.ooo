---
{
	"title": "timeout()",
	"terms": "timeout pause settimeout await duration delay flow once",
	"description": "The `timeout()`{js} function creates a `Flow`{js} object that fires once after the given delay, similar to `setTimeout()`{js}."
}
---

## Syntax

```js
timeout(duration);
```

### Parameters

`duration`{arg}
: The time (in milliseconds) for the timeout.

### Return value

A [`Flow`](/docs/flow/) object that triggers once after the given `duration`{arg}. After it has triggered, the flow is automatically stopped. The trigger does not receive arguments.

## Details

Functionally, `timeout()`{js} is similar to a native `setTimeout()`{js}, with slightly different syntax to provide a better developer experience. Since it is flow-based, it can be used together with `await`{js}. Additionally, flows participate in [monitored](/docs/monitor/) contexts of [type "undo"](/docs/monitor/undo/), meaning `timeout()`{js} can safely be used inside [`connected()`](/docs/components/connected/), [`effect()`](/docs/effect/), [`purify()`](/docs/purify/), and more.

This function is equivalent to using [`interval()`](/docs/interval/) together with [`.once()`](/docs/flow/once/).

## Examples

### Show a toast

In this example, we'll implement a simple toast message system. We'll be able to call a function `showToast()`{js} to append a toast message to the `<body>`{html}, and after `7000`{js} milliseconds, we'll remove it. The creation of the elements for the toast message has been omitted for brevity.

```js
function createToastElement(text){/* … */}

async function showToast(text){
	const toast = createToastElement(text);
	const closeButton = toast.querySelector('.close');
	document.body.append(toast);
	await timeout(7000);
	toast.remove();
}

// usage…
showToast('Settings saved.');
```

Note that usually we'd want a [`.once()`](/docs/flow/once/) when using a flow in conjunction with `await`{js}, but here that's not necessary because `timeout()` can only ever trigger once and cleans up after that automatically. In other words, `timeout()`{js} has `.once()`{js} behavior built-in.

### Timeouts

In cases where it is unsure whether or not a certain event might fire, `timeout()`{js} helps us cleanly implement a timeout mechanism. To go back to the previous example, sometimes toast message have a "close" button, allowing the user to dismiss the message earlier than it would otherwise. If they don't close the message manually, it closes after the specified time. To achieve this, we could modify the previous example like so:

```js
function createToastElement(text){/* … */}

async function showToast(text){
	const toast = createToastElement(text);
	const closeButton = toast.querySelector('.close');
	document.body.append(toast);
	await when(closeButton).clicks()
		.or(timeout(7000))
		.once();
	toast.remove();
}
```

Here we use `timeout()`{js} in combination with [`.or()`](/docs/flow/or/) and [`.once()`](/docs/flow/once/) so that the `await`{js} expression resolves when either the user has clicked the `closeButton`{js}, or when the `7000`{js} milliseconds have elapsed. Note that we could just as well swap the [`when()`](/docs/when/) expression and the `timeout()`{js}, since both are `Flow`{js} objects.

### In monitored contexts

Since `timeout()`{js} is flow-based, it participates in monitored contexts of [type "undo"](/docs/monitor/undo/). This can make some patterns much simpler to implement. Let's continue building on the toast messages (for simplicity, one without a "close" button) and implement it so that we reuse the same toast message instead of creating a new one every time we call `showToast()`. We'll simply replace the text in the toast message instead:

```js
const toast = createToastElement();
const message = toast.querySelector('.message');

const showToast = purify(async (text) => {
	message.textContent = text;
	document.body.append(toast);
	await until(timeout(7000));
	toast.remove();
});
```

We use [`purify()`](/docs/purify/) to make sure previous `timeout()`{js} calls are cleaned up if we call `showToast()`{js} again before the timeout has resolved. With `setTimeout()`, we'd need to be careful to do this manually. If we remove the `purify()`{js}, then the `timeout()`{js} calls are not cleaned up; this means that a previous call to `showToast()`{js} will remove the toast from the DOM after 7 seconds even if the function is called again before then.

## See also

- [`Flow`](/docs/flow/)
- [`interval()`](/docs/interval/)
- [`until()`](/docs/monitor/until/)
