---
{
	"layout": "layouts/docs.liquid",
	"title": "keychange event",
	"terms": "keychange event keys live variable iterat fire dispatch attach listener",
	"description": "The `keychange`{str} event is dispatched on live variables wrapping an object, when keys are created or deleted."
}
---

The event does not fire when a key's value changes (only if it is new or deleted), and therefore is not suitable for listening to all changes to a live variable. Use the [`change`](/docs/live/change/) event for that instead.

:::warning
**Warning:** This is a low-level API. In most cases, there are more ergonomic alternatives available, such as directly passing a live variable to `Object.keys()`{js} in an [`effect()`](/docs/effect/).
:::

## Syntax

```js
when($live).keychanges().then(event => {
	// …
});

$live.addEventListener('keychange', event => {
	// …
});
```

### Event details

The event fires only on objects, when new keys are added, or existing ones are deleted. Non-objects (and `null`{js}) are considered not to have any keys. Functions are considered objects and may have keys. More specifically, an `instanceof Object`{js} test determines whether the value's keys are observed. This is to avoid unexpected behavior like character indexes on strings being included in the key diffing (which could be a big performance hit for large strings).

The event, like `Object.keys()`{js}, does not consider symbols; adding or removing symbols from an object never triggers the `keychange`{str} event.

The `keychange`{str} event exposes some details under the `event.detail`{js} property:

`event.detail.keys`{js}
: An array of string keys that were deleted or created on the object wrapped by the live variable.

## Examples

### Object.keys()

The `keychange`{str} event mostly exists for internal purposes and is rarely useful outside of that. Specifically, it is used for live variables to properly react to iteration and other such operations.

So, for this example, let's do something a bit inefficient for the sake of learning. We'll take one live variable wrapping an object, and then have another live variable keep track of the object's keys. We'll use [`live.link()`](/docs/live/link/) to make sure they stay in sync.

```js
const $ = live({
	object: { foo: 23, bar: -7 }
});

live.link($.$keys, {
	get: () => Object.keys($.object),
	changes: when($.$object).keychanges()
});
```

Now, when the object sees a key getting removed or added (and only then), the `live.link()`{js} will update. If we, on the other hand, use the [`change`](/docs/live/deepchange/) event instead, then the link would update much more often than necessary, which would be inefficient. The reason `keychange`{str} is generally not needed is because its use-case is almost entirely covered by Yozo internals; the above could be rewritten to

```js
const $ = live({
	object: { foo: 23, bar: -7 }
});

live.link($.$keys, () => Object.keys($.$object));
```

This also uses the `keychange`{str} event under the hood, but is abstracted away and therefore (presumably) a bit easier to think about.

## See also

- [live](/docs/live/)
- [`deepchange`](/docs/live/deepchange/)
- [`change`](/docs/live/change/)
- [`live.link()`](/docs/live/link/)
