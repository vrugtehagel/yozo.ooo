---
{
	"layout": "layouts/docs.liquid",
	"title": "monitor.ignore()",
	"description": "Avoid live variables or flows from being seen by monitored contexts such as inside effects with `monitor.ignore()`{js}."
}
---

:::warning
**Warning:** This is a low-level API. Often (but not always) the use of `monitor.ignore()`{js} indicates misuse of other functionality. Before use, assess whether or not there are more semantic alternatives to structure the code in.
:::

## Syntax

```js
monitor.ignore(callback);
```

### Parameters

`callback`{arg}
: A callback, everything in which is (synchronously) witheld from the current monitored context.

### Return value

The same as the return value from `callback`{arg}, i.e. whatever `callback`{arg} returns is passed on and returned by the `monitor.ignore()`{js} call.

## Details

Only one monitored context can exist at any given time. They do not nest; creating one while another is already open "pauses" the latter until the former is closed. As such, `monitor.ignore()`{js} is equivalent to opening a new monitored context (one that monitors nothing) for the duration of the callback.

If there is no monitored context to ignore, then the function does essentially nothing but returning the result of the callback.

## Examples

### Ignore a live variable

In this example, we'll build a component in a somewhat convoluted way, to demonstrate how `monitor.ignore()`{js} could help in some situations (though in this case it wouldn't actually be necessary). The component lets the user type something, and shows the typed text outside the `<input>`{yz} along with a "last updated" timestamp. However, for the "last updated" timestamp, we'll create a live variable `$.$now`{js} which updates every second to reflect the current time, and we'll use that to render the timestamp.

```yz
<title>input-with-timestamp</title>
<template mode="closed">
	<input type="text">
	<output></output>
</template>
<script>
const input = query('input');
const output = query('output');

live.link($.$value, input);
live.link($.$now, {
	get: () => new Date().toLocaleString(),
	changes: interval(1000),
});

effect(() => {
	const timestamp = monitor.ignore(() => $.now);
	const updated = `(last updated: ${timestamp})`;
	output.textContent = `${$.value} ${updated}`;
});
</script>
```

This component now updates the typed value only while typing. When the user stops typing, the "last updated" timestamp is stagnant. If we, on the other hand, remove the `monitor.ignore()`{js}, then the effect depends on `$.now`{js} and runs every time that's updated (which is every second). Trying that, we can see the timestamp steadily ticks up even if we don't type.

Of course, this component would be better off without `$.$now` and just retrieving the timestamp whenever necessary instead of continuously updating a live variable with the current time.

## See also

- [`monitor()`](/docs/monitor/)
- [`live()`](/docs/live/)
- [`Flow`](/docs/flow/)
