---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.now()",
	"description": "The `js`flow.now()`` method triggers a flow, optionally with arguments to pass to the callbacks in the flow pipeline."
}
---

## Syntax

```js
flow.now();
flow.now(...args);
```

### Parameters

`arg`...args`` <mark>optional</mark>
: Any number of arguments to pass to the callbacks in the pipeline.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

:::info
**Note:** Once a flow is stopped, either through [`flow.stop()`](/docs/flow/stop/), [`flow.until()`](/docs/flow/until/), or something else, it no longer triggers even when manually calling `js`.now()`` on them.
:::

## Examples

### Immediate event handler

Using `js`flow.now()``, we can create an event listener, and immediately fire it to execute the callback. For example, say we want an element to follow the mouse after clicking it. Thus, inside the click handler, we can both set up a `str`mousemove`` handler, and fire it immediately to place the element right away.

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

This works, because the only properties on the event that we care about are `js`event.pageX`` and `js`event.pageY``. So although the `str`click`` event differs in some ways from the `str`mousemove`` event, we can pass it to the `str`mousemove`` handler and everything works just fine. In some cases, we'll need to create a manual object to mimic the shape of the event we're calling `js`.now()`` for; in others, we don't need to pass an argument at all.

## Usage notes

It is possible to create an "empty" [flow](/docs/flow/) object (i.e. construct one by passing an empty callback to the [`Flow` constructor](/docs/flow/constructor/)), and then triggering it manually with `js`.now()``. However, this is not advised; when using the constructor, Yozo is able to warn about flows that have been stopped but are still triggering (which indicates improper cleanup). However, it does not warn about triggers being triggered through `js`.now()``. In other words, it is strongly recommended to handle the triggers for a manually created flow inside the constructor callback instead of using `js`.now()``.


## See also

- [flows](/docs/flow/)
- [`Flow` constructor](/docs/flow/constructor/)
- [`flow.then()`](/docs/flow/then/)
