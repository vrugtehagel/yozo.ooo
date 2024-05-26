---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.now()",
	"terms": "flow now trigger manual arguments pipeline",
	"description": "The `flow.now()`{js} method triggers a flow, optionally with arguments to pass to the callbacks in the flow pipeline."
}
---

## Syntax

```js
flow.now();
flow.now(...args);
```

### Parameters

`...args`{arg} <mark>optional</mark>
: Any number of arguments to pass to the callbacks in the pipeline.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

:::info
**Note:** Once a flow is stopped, either through [`flow.stop()`](/docs/flow/stop/), [`flow.until()`](/docs/flow/until/), or something else, it no longer triggers even when manually calling `.now()`{js} on them.
:::

## Examples

### Immediate event handler

Using `flow.now()`{js}, we can create an event listener, and immediately fire it to execute the callback. For example, say we want an element to follow the mouse after clicking it. Thus, inside the click handler, we can both set up a `mousemove`{str} handler, and fire it immediately to place the element right away.

```js
const { when } = window.yozo;
const element = document.querySelector('…');
const body = document.body;

when(element).clicks().then(event => {
	when(body).mousemoves().then(({ pageX, pageY }) => {
		element.style.left = `${ pageX }px`;
		element.style.top = `${ pageY }px`;
	}).now(event);
});
```

This works, because the only properties on the event that we care about are `event.pageX`{js} and `event.pageY`{js}. So although the `click`{str} event differs in some ways from the `mousemove`{str} event, we can pass it to the `mousemove`{str} handler and everything works just fine. In some cases, we'll need to create a manual object to mimic the shape of the event we're calling `.now()`{js} for; in others, we don't need to pass an argument at all.

## Usage notes

It is possible to create an "empty" [flow](/docs/flow/) object (i.e. construct one by passing an empty callback to the [`Flow` constructor](/docs/flow/constructor/)), and then triggering it manually with `.now()`{js}. However, this is not advised; when using the constructor, Yozo is able to warn about flows that have been stopped but are still triggering (which indicates improper cleanup). However, it does not warn about triggers being triggered through `.now()`{js}. In other words, it is strongly recommended to handle the triggers for a manually created flow inside the constructor callback instead of using `.now()`{js}.


## See also

- [flows](/docs/flow/)
- [`Flow` constructor](/docs/flow/constructor/)
- [`flow.then()`](/docs/flow/then/)
