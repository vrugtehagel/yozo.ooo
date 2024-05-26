---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.debounce()",
	"terms": "flow debounce duration delay triggers callback pipeline limit throttle",
	"description": "Introduce a debounce on the flow's callback pipeline, limiting the amount of triggers coming through."
}
---

Debouncing limits triggers by ignoring all triggers until a certain amount of time passes that no triggers were received. More intuitively, it waits for a certain duration of inactivity before letting a trigger through.

:::info
**Note:** Throttling lets through a trigger as often as possible, but no more than once every `duration`{arg}. A debounce may not let any triggers through for as long as it is receiving triggers more often than once every `duration`{arg}. For throttling, see [`.throttle()`](/docs/flow/throttle/).
:::

## Syntax

```js
flow.debounce(duration);
```

### Parameters

`duration`{arg}
: A number of milliseconds to use for the debounce.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Details

While the `.debounce()`{js} method only receives a number, it does internally add a callback to the flow's pipeline, and a non-linear one at that. Some triggers it receives are swallowed, if another trigger reaches the callback before the `duration`{arg} runs out.

Specifically, the triggers that make it through are those which were not followed by another for the entirety of the `duration`{arg}. This may be relevant for pipelines that wish to use the trigger arguments.

## Examples

### Search box

When writing a search box with suggestions, we generally want to prevent sending a request every single keystroke; that would bombard the server with multiple requests per second per user searching. Instead, we can use a debounce to wait until the user is done typing, or otherwise inactive. Using [`when()`](/docs/when/) in combination with `.debounce()`{js} is perfect for this use case:

```js
const input = document.querySelector('#search-input');
when(input).inputs().debounce(500).then(() => {
	// fetch and display suggestions
});
```

Note that `.throttle()`{js} would probably be less appropriate here because `.throttle()`{js} would fire every `duration`{js} milliseconds given the user is typing faster than the `duration`{js}. This results in the requests being somewhat arbitrary when it comes to the search terms, because the user is still in the middle of typing. Using `.debounce()`{js} gives us a more natural point to do the search requests, because most of the time, the user stops typing when the search term is (semi-)complete.

## Usage notes

If the debounce queues up a trigger, but the flow is stopped (e.g. through [`.stop()`](/docs/flow/) or through a monitored context's [undo](/docs/monitor/undo/)) then the queued-up trigger is cleaned up as well and does not fire. More generally, stopped `Flow` objects can no longer fire triggers, and this also applies to debounced triggers.

## See also

- [`flow.throttle()`](/docs/flow/throttle/)
- [`when()`](/docs/when/)
- [`Flow`](/docs/flow/)
