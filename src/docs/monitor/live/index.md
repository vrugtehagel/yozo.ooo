---
{
	"title": "Monitoring \"live\"",
	"terms": "monitoring live type variable depend",
	"description": "Live variables can be monitored, allowing authors to react to changes in dependencies of a certain callback."
}
---

## Details

Monitored live contexts "see" live variables being used. The most common monitored expression is simply reading the value of a live variable (e.g. `$.foo`{js} or `live.get($.$foo)`{js}). These accesses delegate a change in the read variable to the value exposed by [`monitor()`](/docs/monitor/). There are also operations that do not read the value of a certain variable, but rely on the existance of one or more keys. Examples of this are `Object.keys()`{js}, the `in`{js} operator, or iteration such as `for…of`{js} loops. These types of operations are also monitored, but instead delegate `keychange`{str} events on the live variable in question to the exposed value on the return value from `monitor()`{js}. This mechanism allows for granular reactive responses to changes in live variables and is what powers Yozo's reactivity system.

:::warning
**Warning:** The live monitoring mechanism exists almost entirely for internal purposes. The [`effect()`](/docs/effect/) helper function covers the vast majority of use cases for monitoring live variables. Monitoring live variables manually should only be done as a last resort.
:::

While possible, it is not advised to manually add live variables to the monitored context using [`monitor.add()`](/docs/monitor/add/). Instead, access the live variable using a simple property access or [`live.get()`](/docs/live/get/). For adding it as a `'keychange'`{js} variable, used for iteration and reading keys as opposed to value, call `Object.keys()`{js} on the variable, iterate it, or use `in`{js} on it.

When adding a live variable to the monitored context, `monitor.add()`{js} expects two additional arguments beyond the first argument `'live'`{js}. The second argument must be the live variable to add to the context. The third argument must be an event type (as a string) emitted by live variables, e.g. `'keychange'`{js} or `'deepchange'`{js}.

When monitoring for live variables, the object returned by [`monitor()`](/docs/monitor/) has a `.live`{js} key. Its value is an `EventTarget`{js} that fires a `change`{str} event anytime a monitored live variable has fired the event it was added for. This `EventTarget`{js} implicitly holds references to the monitored live variables, and so must not be kept in memory unless prolonged listening for changes is desired.

Theoretically, live variables can be added to monitored contexts that have been undone using the ["undo" type](/docs/monitor/undo/). However, when using [`until()`](/docs/monitor/until/) properly, this is extremely unlikely. Adding the same live variable multiple times does not cause the `EventTarget`{js} to fire multiple `change`{str} events; the `monitor.add()`{js} calls are collected by reference.

## Examples

### Manually adding

For the sake of documentation, let's look at an example for adding a live variable to a monitored context using `monitor.add()`{js}.

```js
const $object = live({ foo: 23 });

const call = monitor(['live'], () => {
	monitor.add('live', $object.$foo, 'deepchange');
});

when(call.live).changes().then(() => {
	console.log('$object.foo changed!');
});
```

Now, whenever `$object.$foo`{js} changes value, our `console.log()`{js} will run:

```js
$object.foo = 10; // "$object.foo changed!"
```

In general, the `change`{str} listeners attached to `call.live`{js} are added using [`.once()`](/docs/flow/once/) or `{ once: true }`{js}, since indefinite side effects to changing live variables is often undesirable.

Note that instead of using `monitor.add()`{js} in this example, we can instead access `.foo`{js} like normal, to achieve the same behavior:

```js
const call = monitor(['live'], () => {
	$object.foo;
});
```

## See also

- [`live()`](/docs/monitor/live/)
- [`monitor.add()`](/docs/monitor/add/)
- [`live.get()`](/docs/monitor/live/)
- [`monitor()`](/docs/monitor/)
- [`monitor.register()`](/docs/monitor/register/)
- [`until()`](/docs/monitor/until/)
- [`when()`](/docs/when/)
