---
{
	"layout": "layouts/docs.liquid",
	"title": "live.set()",
	"description": "`live.set()`{js} is a somewhat low-level way to set the underlying value of a live variable."
}
---

To set a property on a [live](/docs/live/) variable (such as a key on the component state variable [`$`](/docs/components/$/)), traditional property setting like `$.key = value`{js} is a simpler way of setting live variables. `live.set()`{arg}'s primary use case is when only a reference to the live variable itself is available (such as in low-level utility functions).

:::info
**Note:** To delete a live variable, that is, remove it from its parent object, use [`live.delete()`](/docs/live/delete/).
:::

## Syntax

```js
live.set($live, value);
```

### Parameters

`$live`{arg}
: A live variable to set. The value technically does not need to be live, nor settable, but in those cases `live.set()`{js} does nothing.

`value`{arg}
: The new value for the live variable. If this is a live variable itself, then it is unwrapped first.

### Return value

A boolean indicating whether the value was successfully set or not (`true`{js} if it was successful, `false`{js} otherwise).

If the `$live`{arg} argument is not live, then the value is not set and `false`{js} is returned. If the live variable is not settable, for example when passing `$object.$foo`{js} when `$object`{js} is wrapping `null`{js}, then also `live.set()`{js} fails and `false`{js} is returned. Otherwise, setting should be successful and `true`{js} is returned.

## Details

Setting a live variable (either through `live.set()`{js} or setting a property the traditional way) does not add it to the monitored context of [type "live"](/docs/monitor/live/). However, if the `value`{arg} argument is a live variable, it is unwrapped before the setting happens, which means the `value`{arg} variable is then added to the monitored context.

## Examples

### Manual state

When creating a live variable manually (through [`live()`](/docs/live/)) to keep track of state, it is possible, though not advised, to use a single live variable for a single primitive value. In this example, we'll create a `$number`{js} variable that represents a number, and then we'll create a `$double`{js} variable linked to it using [`live.link()`](/docs/live/link/).

```js
const $number = live(23);
const $double = live();
live.link($double, () => live.get($number) * 2);

console.log(live.get($double)); // 46

live.set($number, 5);

console.log(live.get($double)); // 10
```

However, the recommended way to keep track of state is to create a live container object. This allows for regular property setting and accessing, making for clearer, simpler code.

```js
const $state = live({ number: 23 });
live.link($state.$double, () => $state.number * 2);

console.log($state.double); // 46

$state.number = 5;

console.log($state.double); // 10
```

Note that it completely removes the need for `live.get()`{js} and `live.set()`{js} calls. Additionally,

## See also

- [live](/docs/live/)
- [`live.delete()`](/docs/live/delete/)
- [`live.get()`](/docs/live/delete/)
- [`live.link()`](/docs/live/delete/)
