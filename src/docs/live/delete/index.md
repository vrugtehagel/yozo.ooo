---
{
	"layout": "layouts/docs.liquid",
	"title": "live.delete()",
	"description": "The `live.delete()`{js} helper is a relatively low-level way to delete a live variable from its parent object, similar to the `delete`{js} operator."
}
---

Instead of using `live.delete()`{js} to delete a live variable from its parent object, consider instead using the traditional deletion syntax like `delete $.key`{js}. The main use for `live.delete()`{js} is when there is no reference to the parent object available, which happens mostly in custom utility functions.

## Syntax

```js
live.delete($live);
```

### Parameters

`$live`{arg}
: A live variable to delete from its parent object.

### Return value

A boolean, indicating whether or not the deletion was successful, similar to how `delete`{js} expressions evaluate to a boolean. If the `$live`{js} argument is not live, `false`{js} is returned. Likewise, if the live variable does not have a parent object (for example, when the value of the parent is `null`{js}), then `false`{js} is returned. Like `delete`{js}, attempting to delete a non-configurable property also fails and returns `false`{js}.

When the deletion is successful, `live.delete()`{js} returns `true`{js}.

## Details

Deleting a live variable off the parent object does not add it or its parent to the monitored context of [type "live"](/docs/monitor/live/), since the value is not read.

It is possible to delete the root variable, that is, the one created by a [`live()`](/docs/live/) call. This variable has a parent, but it is entirely internal, and as such, deleting it is equivalent to setting its value to `undefined`{js}. Since its deletion might be confusing, it is advised to use [`live.set()`](/docs/live/set/) instead, explicitly setting it to `undefined`{js} or `null`{js}.

## Examples

### Resulting events

When deleting a key off of a parent object, both the value under that key changes (unless it was already `undefined`{js}), but the parent also loses the key as per the `Object.keys()`{js} function. To see this in action, consider the following:

```js
const $object = live({ foo: 23, bar: 10 });

when($object).keychanges().then(() => {
	console.log('keychange!');
});
when($object.$foo).changes().then(() => {
	console.log('foo changed!');
});

live.delete($object.$foo); // "foo changed!" "keychange!"
```

We may also `delete $object.foo`{js}, which is functionally identical and should be preferred for readability. However, when writing utility functions that need to delete a variable, but don't have a reference to the parent, `live.delete()`{js} is the only way to delete a key off of the parent.

## See also

- [`live()`](/docs/live/)
- [`live.get()`](/docs/live/get/)
- [Monitoring "live"](/docs/monitor/live/)
