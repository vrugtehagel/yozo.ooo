---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.throttle()",
	"terms": "flow throttle duration limit triggers callback pipeline debounce",
	"description": "Throttle triggers in a flow's callback pipeline, using a fixed rate limit."
}
---

## Syntax

Throttling limits triggers by letting them through as much as possible but at most once per specified duration.

:::info
**Note:** Conversely, debouncing waits for a certain duration of inactivity before letting a trigger through. For debouncing, see [`.debounce()`](/docs/flow/debounce/).
:::

```js
flow.throttle(duration);
```

### Parameters

`duration`{arg}
: A duration as a number in milliseconds, indicating the throttle rate limit.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on, allowing for method chaining.

## Details

The first trigger is let through immediately; subsequent triggers are let through as often as possible as long as they do not exceed the limit. While the limit prevents triggers from being let through, the last one is queued up to fire at the end of the `duration`{arg}. In other words: the throttled triggers are always as up-to-date as possible, which is relevant when the trigger arguments are used.

Even though `.throttle()`{js} only receives a number as argument, it still adds a callback to the flow's pipeline. This is a non-linear callback, meaning it will swallow triggers if multiple are received in the specified `duration`{arg}, as mentioned above.

## Examples

### Throttling scroll events

Scroll events can fire at a high rate, so especially when altering and/or reading layout it can be a good idea to throttle the incoming events. That way, any animations or scroll-linked effects can remain smooth to the user, without the performance penalty a page would pay when doing such computations every single `scroll`{str} event.

```js
when(document).scrolls().throttle(16).then(() => {
	// do computationally/layout-intensive tasks…
	updateScrollLinkedState(window.scrollY);
});
```

Here we use [`when()`](/docs/when/) to create a [`Flow`](/docs/flow/) object for the `scroll`{str} event on the `document`{js}; then we run the events through a `.throttle()`{js} with a duration of approximately one frame (60 frames per second is about `16`{js} milliseconds per frame). This means the actual computations only happen at most once every frame, but not when there are no `scroll`{str} events.

## See also

- [`flow.debounce()`](/docs/flow/debounce/)
- [`when()`](/docs/when/)
- [`Flow`](/docs/flow/)
