---
{
	"layout": "layouts/docs.liquid",
	"title": "live.get()",
	"description": "Unwrap a live variable to find the underlying value, or retrieve the value at any key of a live object."
}
---

## Syntax

```js
live.get($live);
live.get($live, key);
```

### Parameters

`$live`{arg}
: Either a [live](/docs/live/) variable to unwrap, or to read a key off of. This value may also be any other non-live value, in which case the function returns the value itself (or, in case a key is provided, acts like a property access).

`key`{arg} <mark>optional</mark>
: A string (or symbol) representing a key on the `$live`{arg} object to access.

### Return value

When omitting the `key`{arg} argument, the return value is the non-live version of the `$live`{arg} argument. If it is not live to begin with, then `$live`{arg} itself is returned; otherwise, the live `$live`{arg} is unwrapped and its underlying value is returned.

:::info
**Note:** Accessing a live variable adds it to the monitored context (if [type "live"](/docs/monitor/live/) is monitored). This includes calls to `live.get()`{js}.
:::

If a non-nullish key is provided, the unwrapped value at the `key`{arg} property is returned. This is regardless of whether or not the first argument is live. In most cases, this is equivalent to a regular property access, `$live[key]`{js}, but not always. Specifically, it is not the same if key is a string starting with a dollar symbol. For example, `$live.$foo`{js} retrieves the live variable around the value at the `'foo'`{js} key (note the lack of a dollar symbol) whereas `live.get($live, '$foo')`{js} retrieves the unwrapped value at the `'$foo'`{js} key. In other words, if the key does not start with a dollar symbol, then property accessing is safe; in other cases, such as dynamic keys or in low-level functions, use `live.get()`{js}.

## Examples

### In component files

In component definitions, specifically using the state variable [`$`](/docs/components/$/), unwrapping a live variable manually is rarely necessary. Unless there's a need for unwrapping `$`{js} itself (which rarely happens), we can simply use the property access notation without the dollar prefix to access values. Let's say we have the following:

```yz
<title>just-an-example</title>
<meta attribute="text" type="string">
<script>
when($.$text).changes().then(() => {
	// …
});
</script>
```

In this example, we create an attribute `text`{attr} with corresponding property `.text`{js}. In the script section, we then get the live variable `$.$attributes.$text`{js} for the attribute, and `$.$text`{js} for the property. However, we don't need `live.get()`{js} to read their values; we can write `$.$attributes.text`{js} and `$.text`{js} respectively (note: we omit the dollar prefix for the last item in the chain).

Now, let's do something a bit weird; we'll create another component "pay-me", with a dollar-prefixed attribute `$money`{js}. We'll then be able to use it as `<pay-me $money="5"></pay-me>`{html}. Our definition is comparable to the above:

```yz
<title>pay-me</title>
<meta attribute="$money" type="number">
<script>
when($.$$money).changes().then(() => {
	// …
});
</script>
```

Note that we need a double-dollar to get the live variable for the `.$money`{js} property; prefixing `$money`{js} with a dollar ends up being `$$money`{js}. Also, we can't actually access the property's value just with a property access like we're used to; `$.$money`{js} gives us a live variable around `$.money`{js}, instead of the value for the `.$money`{js} property. To read the value, we'll need either `live.get($, '$money')`{js} or alternatively `live.get($.$$money)`{js}.

Given it's rather awkward to deal with properties that start with dollar symbols, it is not recommended to create situations where this is the case. Starting an attribute (or its corresponding property) with a "$" is generally not a good choice to make, not just as an author, but users also generally do not expect non-alphanumeric characters in attribute names, properties, or methods.

### Iterating live objects

When iterating over live objects directly, either in the form or regular array iterations or using static methods such as `Object.keys()`{js}, the keys are always dollar-prefixed, and as such, the values are live. To retrieve the values, we'll use `live.get()`{js} like so:

```js
const { live } = window.yozo;
const $array = live([ 5, 7, 0, 13 ]);
const $object = live({ foo: 23, bar: 'baz' });

for ($item of $array){
	const value = live.get($item);
	// …
}

Object.entries($object).forEach((prefixedKey, $value) => {
	const key = prefixedKey.slice(1);
	const value = live.get($value);
	// …
});
```

In the latter, we can find the unprefixed key by simply slicing off the prefix (through `.slice(1)`{js}). We could then theoretically retrieve the value through `$object[key]`{js}, granted the unprefixed key does not itself also start with a dollar symbol. This is not really a more readable way to retrieve the value, though, and a bit more prone to errors; so, it is advised to use `live.get()`{js} as the example demonstrates.

## Usage notes

Accessing a live variable's value, in any shape or form, adds the accessed variable to the monitored context (if there is one). Specifically, `live.get($data.$foo)`{js} is equivalent to `live.get($data, 'foo')`{js}, which is equivalent to `$data.foo`{js}. All of these add `$data.$foo`{js} to the monitored context, listening for [deepchange](/docs/live/deepchange/) events. See [monitoring "live"](/docs/monitor/live/) for more information.

## See also

- [live()](/docs/live/)
- [live.set()](/docs/live/set/)
- [deepchange event](/docs/live/deepchange/)
- [monitoring "live"](/docs/monitor/live/)
