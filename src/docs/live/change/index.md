---
{
	"title": "change event",
	"terms": "change event live variable state old value fire dispatch attach listener",
	"description": "The `change`{str} event fires on a live variable when its value changes."
}
---

It is primarily useful for [live](/docs/live/) variables wrapping primitives or otherwise non-branching values. For objects, listening for nested changes is often desirable, and should be done using the [`deepchange`](/docs/live/deepchange/) event.

## Syntax

```js
when($live).changes().then(event => {
	// …
});

$live.addEventListener('change', event => {
	// …
});
```

## Event details

The `change`{str} event does not fire if the live variable did not change, even when explicitly setting it to the value it already has. The event exposes the old and new value of the live variable under the `event.detail` property.

`event.detail.oldValue`{js}
: The value of the live variable before it changed.

`event.detail.value`{js}
: The new value of the live variable.

## Examples

### Aliasing

We can use [`live.link()`](/docs/live/link/) to alias one live variable to another, keeping them in sync at all times. To do this, we'll use the `change`{str} event for the `changes` option, like so:

```js
live.link($.$aliased, {
	get: () => $.original,
	set: value => $.original = value,
	changes: when($.$original).changes()
})
```

Note that this only really works when the live variables in question are non-branching values; if they are objects, then the aliasing link does not know about nested changes for `$.original`{js}, nor does it know about nested changes in `$.aliased`{js}.

### Old attribute value

In the native custom elements API, authors can use the `attributeChangedCallback()` to listen to changes in attribute values. The lifecycle callback does not only expose the attribute name and new value, but also its old value. This behavior is often not directly useful, but can be replicated using the `change`{str} event together with the `$.$attributes`{js} object that is exposed on the component's state variable [`$`](/docs/components/$/). Specifically,

```yz
<title>log-changes</title>
<meta attribute="foo">
<script>
when($.$attributes.$foo).changes().then(event => {
	const { value, oldValue } = event.detail;
	console.log(value, oldValue);
});
</script>
```

Note that we can't just listen to the `change`{str} event on the `$.$attributes`{js} variable itself; this is because it is an object. The reference to the object never changes, and therefore the `change`{str} event never fires. We may use the [`deepchange`](/docs/live/deepchange/) event instead, but this event does not expose the old (or new) values of the deepchanges that happened. In other words; if the `oldValue`{js} is needed, then we need to be specific with our listener and use the `change`{str} event on the live variable we need the `oldValue` of.

## See also

- [live](/docs/live/)
- [`deepchange`](/docs/live/deepchange/)
- [`keychange`](/docs/live/keychange/)
- [`live.link()`](/docs/live/link/)
