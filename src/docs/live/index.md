---
{
	"layout": "layouts/docs.liquid",
	"title": "live()",
	"terms": "live variable create manual function react wrapper state effect monitor method event fine grain",
	"description": "The `live()`{js} function creates a reactive wrapper around a value, to be used in effects, component templates or elsewhere."
}
---

:::info
**Note:** Each custom element already receives [`$`](/docs/components/$/), a live variable for state management in the component instance. As such, using `live()`{js} inside component definitions is often not necessary; simply create keys under `$`{js} instead. Use `live()`{js} for creating external live data, such as a global state object.
:::

## Syntax

```js
live(value);
```

### Parameters

`value`{arg}
: Any primitive value, array or object to create a live (reactive) variable for.

### Return value

A live variable. Live variables are objects that "wrap" an underlying value, and fire certain events whenever properties (or nested properties) are modified. Some contexts, such as inside an [`effect()`](/docs/effect/) or in an [`{{ inline }}`](/docs/components/template/inline/) expression in a component's template, react to changes in their live dependencies.

### Methods

Note; these are static methods on the `live`{js} object, not on live variables themselves.

[`live.get()`](/docs/live/get/)
: Unwrap a live variable to retrieve its underlying value, or retrieve a value from a property on a live variable.

[`live.set()`](/docs/live/set/)
: Set the underlying value of a live variable directly.

[`live.delete()`](/docs/live/delete/)
: Delete the underlying value of a live variable directly.

[`live.link()`](/docs/live/link/)
: Link a live variable to other live variables, or a non-live source of dynamic data such as an `<input>`{html} element.

### Events

[`change`](/docs/live/change/)
: An event that fires whenever the underlying value of a live variable directly changes.

[`deepchange`](/docs/live/deepchange/)
: An event that is dispatched whenever any nested property of a live variable changes, including the variable itself.

[`keychange`](/docs/live/keychange/)
: An event that fires any time a property gets added or deleted on the underlying value of a live variable.

## Examples

### .key and .$key
When accessing properties on a live variable, the presence or lack of the dollar symbol determines whether a live variable is returned or the value. Specifically, prefixing a key with the dollar symbol results in a live variable around the value at that key. Leaving it out simply acts like a regular property access.

:::info
**Note:** Because of the way live variables respond to dollar-prefixed property accesses, it is strongly recommended to start the names of live variables (and live variables only) with a "$".
:::

It is quite important to understand and distinguish live variables from from the value they wrap. For example, attaching an event listener requires using the live variable (dollar-prefixed) whereas property retrieval and assignment need the underlying value and therefore need the non-dollar-prefixed versions:

```js
const $data = live({ foo: 23 });

// $data.$foo is a live variable: Live<23>
$data.$foo.addEventListener('change', () => {
	console.log('foo changed!');
});

// $data.foo is just a value; this sets .foo to 24
$data.foo = $data.foo + 1;
// "foo changed!"
```

If the live variable is wrapping an object that happens to have keys that are already dollar-prefixed, then it is not possible to directly get their value through a regular property access. Instead, use [`live.get()`](/docs/live/get/) with the key as second argument.

```js
const $data = live({ foo: 23, $bar: 'baz' });

console.log($data.bar); // undefined
console.log($data.$bar); // Live<undefined>
console.log($data.$$bar); // Live<"baz">
console.log(live.get($data, '$baz')); // "baz"
```

When setting a nested property of a live variable, it is strongly recommended to keep the access chain live (dollar-prefixing all intermediate keys), with the exception of the last key. This is because contexts reacting to changes in live variables can only see changes as far as the first non-live access. For example:

```js
const $data = live({ foo: { bar: { baz: 'qux' } } });
$data.$foo.$bar.baz = 'quux'; // correct

$data.$foo.$bar.$baz = 'quux'; // sets the "$baz" key
$data.foo.bar.baz = 'quux'; // loses reactivity
```

The first is correct since each intermediate live variable is created, and the last `.baz`{js} can be seen by any contexts watching. The second simply sets the `$baz`{js} key instead of the `baz`{js} key (probably a mistake). The last one is a bit more subtle. It first retrieves `$data.foo`{js} (and that becomes a dependency if it is in a monitored context) but after that they are simple property accesses on plain objects, which monitored contexts cannot see. It then also has no idea the `baz`{js} property was set, so it cannot trigger a change event. On the other hand, the first (correct) version to set the `baz`{js} property does fire the change even and does __not__ add a dependency to monitored contexts, because it is setting a value, rather than using one.

Lastly, while possible, it is not recommended to use symbols as keys on live objects. Symbol keys themselves remain reactive, but it is not possible to retrieve the live variable around a value at symbol, since symbols cannot be prefixed with a `$`{js}.

### Tracking contexts

Some contexts, such as inside the [`effect()`](/docs/effect/) callback, monitor live dependencies. Because of this, it's often not needed to manually attach the event listeners to live variables.

In fact, in components, there is even no need for using `live()`{js} itself; each component instance gets [`$`](/docs/components/$/), a live variable for internal component state (including instance properties and attributes). To demonstrate the reactivity, here is a simple click counter component:

```yz
<title>click-counter</title>
<meta attribute="count" type="number">
<template>
	<button @click="$.count++">
		Click count: {{ $.count }}
	</button>
</template>
```

The [`{{ inline }}`](/docs/components/template/inline/) expression inside the template creates a monitored context, so that it can monitor its live dependencies. As it is watching for changes, the template updates whenever `$.count`{js} is altered, with no additional code required. The `$.count`{js} property is linked to the custom element's `count`{attr} attribute, so we both reactively update the component state when the user clicks the button (through `$.count++`{js}) as well as when the `count`{attr} attribute changes.

### Optional chaining

Live variables come with optional chaining built-in. In other words, accessing a property on a live variable will never throw an error, and simply return `undefined`{js} if the live variable's value that the property was accessed on didn't exist. Live variables will still fire events as you'd expect. Here's an example:

```js
const $data = live({ foo: 23 });

console.log($data.$bar.$baz); // Live<undefined>
console.log($data.$bar.baz); // undefined

when($data.$bar.$baz).changes().then(() => {
	console.log('baz changed!');
});

$data.bar = { baz: 'qux' }; // "baz changed!"
```

Note that this also means it is safe to just assume a certain data structure, even before the data structure has been loaded. For example, code may rely on nested keys on a live global state object before the state object exists. This makes it very easy to write clean effects and template logic.

### Iteration

If the value wrapped by a live variable is iterable, then the live variable itself is also iterable. The values (i.e. items) in the iteration are live variables themselves, wrapping the items of the underlying iterable. For example:

```js
const $items = live([ 'foo', 'bar', 'baz' ]);
for (const $item of $items){
	console.log($item); // Live<'foo'>, …
}
```

When using static object methods such as `Object.keys()`{js} or `Object.entries()`{js}, the behavior is in-line with that for arrays. Specifically, for `Object.keys()`{js}, the dollar-prefixed keys are returned. This excludes symbols as well as `'addEventListener'`{js} and other event target-related properties. `Object.entries()`{js} therefore retrieves the prefixed keys paired with their respective live values. In code,

```js
const $data = live({ foo: 23, bar: 'baz' });

for (const [prefixedKey, $value] of Object.entries($data)){
	console.log(prefixedKey); // '$foo', …
	console.log($value); // Live<23>, …
}
```

To find the non-prefixed key, we would need `prefixedKey.slice(1)`{js}. To retrieve the unwrapped value in each iteration, use [`live.get()`](/docs/live/get/).

When it comes to monitoring, there is a non-trivial difference between iterating a live object first and then unwrapping the values individually versus unwrapping the object first and then iterating the plain values. The former monitors only for changes in the values of the iterated object, whereas the latter monitors for any change (or deepchange) in the iterated object itself.

## Usage notes

A few notes about the bavior of live variables. Live variables generally automatically avoid being double-live, meaning that if a live variable is being assigned to another live variable, it is unwrapped and the assignee is set to the non-live value directly. Passing a live variable to `live()`{js} itself does the same; it is unwrapped first, and then a new live variable is created for that value.

When passing the same object reference to `live()`{js} multiple times, new live variables are created for each call. This can lead to confusion, as multiple different live variables are then looking at the same object. When changing a value on one, the other live data structure does not see the change. It is therefore not recommended to do this; re-use a single live variable or data structure instead.

## See also

- [`$`](/docs/components/$/)
- [`effect()`](/docs/effect/)
- [`monitor()`](/docs/monitor/)
