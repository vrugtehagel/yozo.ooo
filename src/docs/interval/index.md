---
{
	"layout": "layouts/docs.liquid",
	"title": "interval()",
	"description": "The `interval()`{js} function creates a flow object that repeatedly triggers, with a fixed delay between each call, similar to `setInterval()`{js}."
}
---

## Syntax

```js
interval(duration);
```

### Parameters

`duration`{arg}
: The time (in milliseconds) that the repeated delay should take.

:::info
**Note:** For animations and other frame-based operations, use [`frame()`](/docs/frame/) instead.
:::

### Return value

A [`Flow`](/docs/flow/) object that triggers in regular intervals of `duration`{arg} milliseconds. The trigger does not receive arguments.

## Details

Functionally, `interval()`{js} is equivalent to the native `setInterval()`{js}, but there are some differences. For one, the syntax is slightly different, in the sense that `setInterval`{js} takes a callback, whereas the [`.then()`](/docs/flow/then/) method is needed to hook into `interval()`{js}. Secondly, `Flow`{js} objects provide some methods that could be helpful for intervals (such as [`.until()`](/docs/flow/until/)), which makes some code easier to write and maintain. Lastly, flows are monitored, and so usage in monitored contexts simplifies things. To demonstrate, let's look at some examples.

## Examples

### The blink tag

Let's, for learning's sake, reimplement the long deprecated HTML `<blink>`{html} tag (we'll name it `<re-blink>`{html}). It will simply blink in and and out of existance every second (1000ms). To do this, we'll be toggling the `hidden`{attr} attribute on the element itself, like so:

```yz
<title>re-blink</title>
<script>
connected(() => {
	interval(1000).then(() => {
		this.hidden = !this.hidden;
	});
});
</script>
<style>
re-blink {
	display: inline;
}
re-blink[hidden]{
	opacity: 0;
}
</style>
```

Specifically, if we'd used `setInterval()`{js} instead of `interval()`{js}, then upon removing and adding the element back to the DOM, the element would start blinking more, and more irregularly, since the intervals would not be properly cleaned up and therefore overlap. With `interval()`{js} on the other hand, we don't need to worry about this.

### Limiting triggers

In this example, we'll write some code that logs 0 through 4 over the span of two seconds. Let's say we want the logging to happen not only every 500ms, but the first log should happen immediately rather than after a delay. To achieve this, we'll be using [`.until()`](/docs/flow/until/) to limit the amount of triggers, combined with [`.now()`](/docs/flow/now/) for the initial trigger:

```js
let number = 0;
interval(500).then(() => {
	console.log(number);
	number++;
}).until(() => number > 4).now();
```

Alternatively, we can use `.until(timeout(2000))`{js}, if we don't want to keep track of the number of triggers that have happened (though in some browsers, this is subject to timer inaccuracies; we may need something like `timeout(2100)`{js}).

:::info
**Note:** while it is possible to use `interval()`{js} in conjunction with [`.once()`](/docs/flow/once/), it is more appropriate to use [`timeout()`](/docs/timeout/) for that behavior.
:::

## Usage notes

To manually stop intervals (without relying on `.until()`{js} or monitored contexts), use the [`flow.stop()`](/docs/flow/stop/) method.

## See also

- [`Flow`](/docs/flow/)
- [`timeout()`](/docs/interval/)
- [`frame()`](/docs/frame/)
