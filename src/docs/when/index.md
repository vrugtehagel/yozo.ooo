---
layout: layouts/docs.liquid

title: when()
description: Through when(), write event listeners in a more readable and streamlined way.

---

## Syntax

```js
when(...targets).does(eventType);
when(...targets).does(eventType, options);
when(...targets)[readableType]();
when(...targets)[readableType](options);
```

### Parameters

`arg`...targets``
: One or more `js`EventTarget`` objects to attach a listener to.

`arg`eventType``
: A string representing the event type to listen to. Equivalent to the first argument to `js`.addEventListener()``.

`arg`options`` <mark>optional</mark>
: An options object, which is passed as third argument to `js`.addEventListener()``. The options `js`once`` and `js`signal`` are not recommended, as more appropriate alternatives are available (specifically, [`flow.once()`](/docs/flow/once/) and [`flow.until()`](/docs/flow/until/) or [`flow.stop()`](/docs/flow/stop/) respectively).

`arg`readableType``
: Similar to `arg`eventType``, but with an extra rule for readability; a single trailing "s" will be stripped off from `arg`readableType`` to find the `js`eventType``. This allows for much more English-sounding expressions such as `js`when(button).clicks()`` or `js`when(image).loads()``.

### Return value

A [`Flow`](/docs/flow/) object that triggers whenever the event triggers on one of the targets. The dispatched event object is passed to the callbacks in the flow. To attach a simple listener like with `js`.addEventListener()``, use the [`flow.then()`](/docs/flow/then/) method.

## Examples

### Basic usage

Attaching simple listeners with `js`when()`` is similar in shape to `js`.addEventListener()``, just a tad more ergonomic and readable:

```js
when(input).inputs().then(event => {
	console.log(event.key);
});

// which is similar to...
input.addEventListener('input', event => {
	console.log(event.key);
});
```

There are a variety of advantages to using `js`when()`` over `js`.addEventListener()``, some of which more prominant than others. The main advantage is that the calls (since they create a `js`Flow`` object) are [monitored](/docs/monitor/), which means the listeners are automatically taken down in certain contexts. For example, when writing a listener inside of the [`js`connected()``](/docs/components/connected/) callback of a component, the hook is monitoring the listeners created inside it and takes them down when the component disconnects. Without `js`when()``, we'd need to manually take down the event listeners when the component disconnects. Another example of the monitoring is inside an `js`effect()`` (which re-runs when any of its [live](/docs/live/) dependencies change):

```js
effect(() => {
	const button = $.activeButton;
	when(button).clicks().then(() => {
		// do the thing…
	});
});
```

In short, it means we can stop worrying about excess event listeners that we forgot to take down, and we can focus on describing what our code does in a simple, concise manner.

### It flows

As described above, in monitored contexts, we generally don't need to worry about taking down event listeners ourselves. However, that's not the only case where `js`when()`` provides an ergonomic developer experience; since it returns a [flow](/docs/flow/), we get all the handy-dandy methods that come with flows. For example:

```js
// debouncing events
when(input).inputs().debounce(300).then(() => {
	// do heavy operation…
});

// combining event listeners
when(button).mousedowns().or(
when(button).touchstarts()).then(() => {
	// button active…
});

// stopping one event based on another
when(box).pointerdowns().then(() => {
	when(document).pointermoves().then(() => {
		// render dragging…
	}).until(when(document).pointerups());
});

// awaiting events
await when(img).loads().once()
	.after(() => img.src = '/cat.jpg');
```

For more information about flows and what you can do with them, see [flows](/docs/flow/).

### The "s" thing

When using `js`when()``'s shorthand, a single "s" is stripped off the event name provided if there is one. To help understanding, here are some examples:

- `js`when(window).scrolls()`` listens for the `js`'scroll'`` event;
- `js`when(audio).pauses()`` listens for the `js`'pause'`` event;
- `js`when(...inputs).change()`` listens for the `js`'change'`` event;
- `js`when(window).appinstalled()`` listens for the `js`'appinstalled'`` event;
- `js`when(document).DOMContentLoaded()`` listens for the `js`'DOMContentLoaded'`` event;
- `js`when(fileReader).focus()`` listens for the `js`'focu'`` event (probably unintentional!)
- `js`when(media).progress()`` listens for the `js`'progres'`` event (also likely unintentional!)

As demonstrated above, in some cases, an extra "s" makes for a very English-sounding expression. In other cases, the event name without the "s" looks a bit better. For almost all native events, this is merely a choice to make. For a handful of events (i.e. the ones that already end in an "s"), the shorthand does not work well; most notably `str`focus``, `str`keypress``, `str`progress`` and `str`success`` (and some variations such as `str`vrdisplayfocus``). For these events, use the longhand like `js`when(…).does('focus')``.

If the shorthand feels weird, keep in mind that `js`.does()`` is always an option; it provides a more familiar string-based interface while retaining all the benefits that come with `js`when()``.

## Usage notes

To avoid monitoring, use [`monitor.ignore()`](/docs/monitor/ignore/) either around the complete `js`when(…).does(…)`` (or the shorthand equivalent) and optionally also around the `js`.then()`` or other methods. In particular, then `js`when()`` function itself returns a "magic" object (i.e. `js`Proxy``) that allows for the shorthand, and so does not by itself create the flow object, which is the part being monitored.

Also, note that the combination of the shorthand and the existance of `js`.does()`` means that it is not possible to listen to the "doe" event using the shorthand. Similarly, it is not possible to listen to the "observe" event using the shorthand, as [`js`when().observes()``](/docs/when/observes/) is reserved for observers. Luckily, these are not native events, so it is rather rare that they need to be listened to. If needed, use `js`.does('doe')`` or `js`.does('observe')`` respectively.

## See also

- [`when().observes()`](/docs/when/observes/)
- [flows](/docs/flow/)
