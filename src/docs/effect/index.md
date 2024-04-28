---
{
	"layout": "layouts/docs.liquid",
	"title": "effect()",
	"description": "Write logical effects depending on live variables, which automatically re-run whenever any of its dependencies change."
}
---

## Syntax

```js
effect(callback);
effect(callback, scheduler);
```

### Parameters

`arg`callback``
: A function (possibly `js`async``) to run as the effect. It introduces a [monitored](/docs/monitor/) context, monitoring both [undo](/docs/monitor/undo/) as well as [live](/docs/monitor/live/) dependencies. Whenever any of the dependencies change, the context is undone and re-run. This means it is safe to attach event listeners with [`when()`](/docs/when/) or do set up other [`Flow`](/docs/flow/)-based

`arg`scheduler`` <mark>optional</mark>
: A function to delay updates with. By default, `js`queueMicrotask()`` is used. To make the effect update synchronously, use `js`update => update()`` (though note that this is generally not a good idea for performance).

### Return value

A [`Flow`](/docs/flow/) object representing the effect. It triggers whenever the effect is re-run. Stopping the flow stops stops the flow from re-running and clears out the monitored context; that is, flows set up in the effect are also taken down.

## Details

The `js`effect()`` function is one of the more significant tools in a component author's toolbelt. Instead of having to maintain exactly when a piece of code needs to run, as well as making sure that code doesn't create memory leaks, `js`effect()`` lets authors write code truly declaratively. Understanding the power in its simplicity is crucial to writing simple components, so let's look at a few examples.

## Examples

### Effects versus listeners

There are two main ways to react to changes in a live variable; either listening to its `str`change`` event, or through an `js`effect()``. Each is slightly different, and they serve different purposes. So, let's compare. Let's say we've got a live variable `js`$.$fruit`` on some component's state variable [`$`](/docs/components/$/). We'll log the value, and then make some changes to `js`$.fruit`` (both synchronous and asynchronous changes). The effect version might look like

```js
effect(() => {
	console.log($.fruit);
});

$.fruit = 'lemon';
$.fruit = 'strawberry'; // "strawberry"
await timeout(100);
$.fruit = 'pear'; // "pear"
```

and the listener variant (using [`when()`](/docs/when/)) would be

```js
when($.$fruit).changes().then(() => {
	console.log($.fruit);
});

$.fruit = 'lemon'; // "lemon"
$.fruit = 'strawberry'; // "strawberry"
await timeout(100);
$.fruit = 'pear'; // "pear"
```

There is one main difference here; in the `js`effect()``, when we changed the value to `js`'lemon'``, it was never logged. This is because effects are scheduled to re-run as soon as possible, but not synchronously. In other words, it "batches" the changes done before it re-runs. In cases where effects depend on many live variables, this is much more efficient.

The event listener sees all the changes, and synchronously so. Thus, it logs `js`'lemon'`` just like it logs all changes.

A way to think of effects is to consider them as describing behavior that is dependent on some state. Event listeners describe code that must run when one or more live variables change (and that it must run _every_ change). The difference is a bit nuanced, and perhaps in general similar in behavior; when in doubt, probably `js`effect()`` is the way to go.

### CSS variables

In some components, it is desirable to bind a live variable to a CSS variable. While [`.property`](/docs/components/template/properties/) syntax allows for doing this in-template for regular CSS properties (through e.g. `yzattr`.style.color="$.color"``), CSS variables cannot be set this way because they are not properties under `js`element.style``. Instead, we can use a short effect to achieve the same:

```yz
<title>my-color</title>
<meta attribute="color" type="string">
<meta attribute="invert" type="boolean">
<template mode="closed">
	<div .class-list.invert="$.invert">
		I am {{ $.color }}
	</div>
</template>
<script>
const div = query('div');

connected(() => {
	effect(() => {
		div.style.setProperty('--my-color', $.color);
	});
});
</script>
<style>
div:not(.invert) {
	color: var(--my-color);
}
div.invert {
	color: color-contrast(var(--my-color) vs white, black);
	background-color: var(--my-color);
}
</style>
```

The `js`effect()`` here opens a monitored context for its callback, and sees `js`$.color`` was accessed; when it changes, the effect re-runs, making sure the `css`--my-color`` variable is always up-to-date. This way of setting the variable is ideal, because it separates code semantically. More specifically, code that updates `js`$.color`` doesn't need to concern itself with what should happen as a result, and the code updating the `css`--my-color`` property doesn't need to concern itself with where the change came from.

Note that the effect is written inside a [`connected()`](/docs/components/connected/) callback; this is because updating the CSS variable is unnecessary when the component is not connected to the document. In general, it is often possible to write `js`effect()`` calls in a `js`connected()`` callback, leading to small performance improvements that add up over many components.

### Listeners in effects

Because `js`effect()`` introduces a fresh new [monitored](/docs/monitor/) context for its callback, both to monitor live variables as well as things to [undo](/docs/monitor/undo/), setting up listeners, observers, or timers in effects is safe (as long as they are `js`Flow``-based). In this example, we create a `html`<click-counter>`` component with a `attr`requiredbl`` attribute. If the component has the attribute, then we require a `str`dblclick`` on the counter button; otherwise, we use a regular `str`click`` event.

```yz
<title>click-counter</title>
<meta attribute="requiredbl" type="boolean">
<meta attribute="amount" type="number">
<template mode="closed">
	<button>Clicks: {{ $.amount }}</button>
</template>
<script>
const button = query('button');

connected(() => {
	effect(() => {
		const type = $.requiredbl ? 'dblclick' : 'click';
		when(button).does(type).then(() => {
			$.amount++;
		});
	});
});
</script>
```

When the effect re-runs, the monitored context is undone before a fresh one is set up. In this case; the event listener we attached is detached, and then set back up again with the new `js`$.requiredbl`` parameter.

Notice that, like the previous example, we use a `js`connected()`` callback; there is no point in having an event listener connected to an element that a user cannot interact with, so there are minor performance benefits to be gained with `js`connected()``.

### Branching dependencies

When indroducing an `js`if()`` branch in an effect, only the live dependencies that are actually used become dependencies of the effect. To demonstrate, let's look at a component that can both add two numbers, or square one. The inputs are two attributes `attr`a`` and `attr`b``, and for the operation we have an `attr`operation`` attribute with the value `str`"add"`` or `str`"square"``.

```yz
<title>add-or-square</title>
<meta attribute="a" type="number">
<meta attribute="b" type="number">
<meta attribute="operation" type="string">
<template mode="closed">
	<output></output>
</template>
<script>
const output = query('output');

connected(() => {
	effect(() => {
		if ($.operation == 'add'){
			output.textContent = $.a + $.b;
		} else if ($.operation == 'square') {
			output.textContent = $.a ** 2;
		} else {
			output.textContent = '';
		}
	});
});
</script>
```

Now, let's say we start off with `attr`a="3"``, `attr`b="5"`` and `attr`operation="add"``. Then, when the effect runs, all three live variables (for each attribute) are dependencies of the effect. Now, if we set `attr`operation="square"``, the effect re-runs, but this time `js`$.b`` is no longer a dependency, because it is not accessed. Subsequently changing e.g. `attr`b="7"`` therefore does not trigger the effect to re-run. If we then end up setting `attr`operation`` back to `str`"add"``, then `js`$.b`` is accessed again, and then once again becomes a dependency of the effect.

This dependency system, where effects depend on _accessed_ variables rather than simply declared ones, is both more ergonomic for the developer as well as ultimately
more efficient when dealing with branching paths or otherwise complex logic.

### Ignoring dependencies

It is possible to use a live variable without including that variable to the monitored context. It is then not treated as a dependency. The way to do this is through [`monitor.ignore()`](/docs/monitor/ignore/). In general, having to do this is a sign indicating unsemantic logic, though there are legitimate use-cases as well. In a nutshell:

```js
effect(() => {
	const dependency = $.foo;
	const ignored = monitor.ignore(() => $.bar);
	// do things…
});
```

## Usage notes

The introduced monitored context is taken down and set back up after the scheduled time. In other words, after a change in dependencies has been detected, any event listeners or other `js`Flow``-based objects are not taken down until the effect has re-run.

## See also

- [`live()`](/docs/live/)
- [`monitor()`](/docs/monitor/)
- [`$`](/docs/components/$/)
- [`connected()`](/docs/components/connected/)
- [`when()`](/docs/when/)
- ["change" event](/docs/live/change/)
