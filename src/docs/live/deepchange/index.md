---
{
	"layout": "layouts/docs.liquid",
	"title": "deepchange event",
	"description": "The `deepchange`{str} event fires on live variables when a variable itself or one of its nested properties has changed."
}
---

This is a relatively low-level way of interacting with [live](/docs/live/) variables; often, using an [`effect()`](/docs/effect/) is more appropriate.

## Syntax

```js
when($live).deepchanges().then(event => {/* … */});
$live.addEventListener('deepchange', event => {/* … */});
```

## Event details

This event exposes no additional details; it dispatches a generic native `CustomEvent`{js} instance.

## Examples

### A live object in localStorage

Let's say we have a live object (with nested properties) and we'd like to remember this object across page visits. To do this, we'll place it in `localStorage`{js} and update the respective `localStorage`{js} key every time the object changes.

```js
const initial = { foo: { bar: 23 }};
const stored = JSON.parse(localStorage.getItem('object'));
const $object = live(stored ?? fallback);
when($object).deepchanges().then(() => {
	const stringified = JSON.stringify(live.get($object));
	localStorage.setItem('object', stringified);
});
```

Now, when changing a nested property on our object (like `$object.$foo.bar = 44`{js}), then the listener triggers and saves the object in localStorage. Had we used the [`change`](/docs/live/change/) event instead, then the listener would have fired only when the value for the object itself changes (e.g. through `live.set($object, {})`{js}), rather than for all nested properties in the object.

## Usage notes

The `deepchange`{str} event fires once for every synchronous change. In other words, if there are multiple nested changes (e.g. through assigning an object that changes multiple properties) the `deepchange`{str} event will still only fire once. If a live variable dispatches either the  [`keychange`](/docs/live/keychange/) or the [`change`](/docs/live/change/) event, then the `deepchange`{str} event is guaranteed to fire as well, and will do so after any `keychange`{str} and `change`{str} events. Specifically, if all three fire on a single live variable, then the `keychange`{str} event is first, followed by the `change`{str} event, and lastly the `deepchange`{str} event.

While the `deepchange`{str} event seems to bubble (similarly to how events bubble on DOM elements), it is not "real" event bubbling; the dispatched events are different `CustomEvent`{js} instances. As such, you cannot stop the propagation (calling `.stopPropagation()`{js} on a `deepchange`{str} event does nothing).

## See also

- [live()](/docs/live/)
- [Live: change event](/docs/live/change/)
- [Live: keychange event](/docs/live/keychange/)
