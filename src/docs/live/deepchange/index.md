---
{
	"layout": "layouts/docs.liquid",
	"title": "deepchange event",
	"description": "The `str`deepchange`` event fires on live variables when a variable itself or one of its nested properties has changed."
}
---

This is a relatively low-level way of interacting with [live](/docs/live/) variables; often, using an [`effect()`](/docs/effect/) is more appropriate.

## Syntax

```js
when($live).deepchanges().then(event => {
	/* … */
});
$live.addEventListener('deepchange', event => {
	/* … */
});
```

## Event details

This event exposes no additional details; it dispatches a generic native `js`CustomEvent`` instance.

## Examples

### A live object in localStorage

Let's say we have a live object (with nested properties) and we'd like to remember this object across page visits. To do this, we'll place it in `js`localStorage`` and update the respective `js`localStorage`` key every time the object changes.

```js
const initial = { foo: { bar: 23 }};
const stored = JSON.parse(localStorage.getItem('object'));
const $object = live(stored ?? fallback);
when($object).deepchanges().then(() => {
	const stringified = JSON.stringify(live.get($object));
	localStorage.setItem('object', stringified);
});
```

Now, when changing a nested property on our object (like `js`$object.$foo.bar = 44``), then the listener triggers and saves the object in localStorage. Had we used the [`change`](/docs/live/change/) event instead, then the listener would have fired only when the value for the object itself changes (e.g. through `js`live.set($object, {})``), rather than for all nested properties in the object.

## Usage notes

The `str`deepchange`` event fires once for every synchronous change. In other words, if there are multiple nested changes (e.g. through assigning an object that changes multiple properties) the `str`deepchange`` event will still only fire once. If a live variable dispatches either the  [`keychange`](/docs/live/keychange/) or the [`change`](/docs/live/change/) event, then the `str`deepchange`` event is guaranteed to fire as well, and will do so after any `str`keychange`` and `str`change`` events. Specifically, if all three fire on a single live variable, then the `str`keychange`` event is first, followed by the `str`change`` event, and lastly the `str`deepchange`` event.

While the `str`deepchange`` event seems to bubble (similarly to how events bubble on DOM elements), it is not "real" event bubbling; the dispatched events are different `js`CustomEvent`` instances. As such, you cannot stop the propagation (calling `js`.stopPropagation()`` on a `str`deepchange`` event does nothing).

## See also

- [live()](/docs/live/)
- [Live: change event](/docs/live/change/)
- [Live: keychange event](/docs/live/keychange/)
