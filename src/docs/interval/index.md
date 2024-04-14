---
{
	"layout": "layouts/docs.liquid",
	"title": "interval()",
	"description": "The `js`interval()`` function creates a flow object that repeatedly triggers, with a fixed delay between each call, similar to `js`setInterval()``."
}
---

## Syntax

```js
interval(duration);
```

### Parameters

`arg`duration``
: The time (in milliseconds) that the repeated delay should take.

### Return value

A [`Flow`](/docs/flow/) object that triggers in regular intervals of `arg`duration`` milliseconds.

## Details

Functionally, `js`interval()`` is equivalent to the native `js`setInterval()``, but there are some differences. For one, the syntax is slightly different, in the sense that `js`setInterval`` takes a callback, whereas the [`.then()`](/docs/flow/then/) method is needed to hook into `js`interval()``. Secondly, `js`Flow`` objects provide some methods that could be helpful for intervals (such as [`.until()`](/docs/flow/until/)), which makes some code easier to write and maintain. Lastly, flows are monitored, and so usage in monitored contexts simplifies things. To demonstrate, let's look at some examples.

## Examples

### The blink tag

Let's, for learning's sake, reimplement the long deprecated HTML `html`<blink>`` tag (we'll name it `html`<re-blink>``). It will simply blink in and and out of existance every second (1000ms). To do this, we'll be toggling the `attr`hidden`` attribute on the element itself, like so:

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

Specifically, if we'd used `js`setInterval()`` instead of `js`interval()``, then upon removing and adding the element back to the DOM, the element would start blinking more, and more irregularly, since the intervals would not be properly cleaned up and therefore overlap. With `js`interval()`` on the other hand, we don't need to worry about this.

### Limiting triggers

In this example, we'll write some code that logs 0 through 4 over the span of two seconds. Let's say we want the logging to happen not only every 500ms, but the first log should happen immediately rather than after a delay. To achieve this, we'll be using [`.until()`](/docs/flow/until/) to limit the amount of triggers, combined with [`.now()`](/docs/flow/now/) for the initial trigger:

```js
let number = 0;
interval(500).then(() => {
	console.log(number);
	number++;
}).until(() => number > 4).now();
```

Alternatively, we can use `js`.until(timeout(2000))``, if we don't want to keep track of the number of triggers that have happened (though in some browsers, this is subject to timer inaccuracies; we may need something like `js`timeout(2100)``).

:::info
**Note:** while it is possible to use `js`interval()`` in conjunction with [`.once()`](/docs/flow/once/), it is more appropriate to use [`timeout()`](/docs/timeout/) for that behavior.
:::

## Usage notes

To manually stop intervals (without relying on `js`.until()`` or monitored contexts), use the [`flow.stop()`](/docs/flow/stop/) method.

## See also

- [``Flow``](/docs/flow/)
- [``timeout()``](/docs/interval/)
