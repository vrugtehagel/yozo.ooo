---
{
	"layout": "layouts/docs.liquid",
	"title": "flow.once()",
	"description": "The `js`flow.once()`` method allows one trigger through in the pipeline and simultaneously stops the flow it was called on whenever that happens."
}
---

## Syntax

```js
flow.once();
```

### Parameters

None.

### Return value

The same [`Flow`](/docs/flow/) object the method was called on.

## Details

The `js`.once()`` method participates in the flow pipeline, but in a bit of a special way. Once a trigger reaches `js`.once()`` in the callback pipeline, two things happen.

- The trigger is allowed through to the rest of the pipeline, and
- any other triggers in the pipeline (ones that have not yet reached `js`.once()``) are stopped in-place.

As a result, there is more flexibility in where you put `js`.once()``, but its position in the pipeline still has meaning. In particular, this behavior is perfect for `js`await`` expressions; more about this in the ["Awaiting flows"](./#awaiting-flows) example below.

:::warning
**Warning:** Theoretically, event listeners can use the native `js`{ once: true }`` option; when using flows, it is strongly recommended to use `js`.once()``. This is because with `js`.once()``, on top of the event listener being cleaned up, the flow itself is also stopped, whereas with `js`{ once: true }`` the flow will remain "alive" while the underlying listener has been removed.
:::

## Examples

### Loading an image

Some events are expected to fire only once, such as the `str`load`` event. For events like these, `js`.once()`` is perfect; it takes down the flow whenever the event fires, meaning there are no concerns about memory leaks. As an example, let's use [`when()`](/docs/when/) in conjunction with `js`.once()`` to load an image and append it to the DOM.

```js
const img = document.createElement('img');
when(img).loads().once().then(() => {
	document.body.append(img);
});
img.src = '/assets/img/mythical-beast.webp';
```

It's also possible to have the `js`.then()`` call before the `js`.once()``; in this case it doesn't matter.

### Positioning .once()

For callback pipelines using only [`.then()`](/docs/flow/then/), it doesn't matter whether `js`.once()`` is put before any `js`.then()`` methods, in between, or after. However, once other methods are thrown in the mix, it starts mattering. First, let's see what happens with [`.if()`](/docs/flow/if/).

- In `js`.once().if(…).then(…)``, the flow is stopped as soon as it triggers, and the `js`.then()`` handler fires only if the trigger passes the condition in `js`.if()``.
- In `js`.if().once(…).then(…)``, the `js`.then()`` handler fires as soon as a trigger passes the condition in `js`.if()``, at which point the flow is stopped.

Similarly, when using [`.await()`](/docs/flow/await/), [`.debounce()`](/docs/flow/debounce/), or any other asynchronous pipeline callbacks, then the position `.once()` has in the callback pipline is also relevant. To take `js`.debounce()`` as an example:

- In `js`.once().debounce(1000).then(…)``, the flow is stopped at the first trigger, and then `js`.then()`` handler fires 1000ms after that.
- In `js`.debounce(1000).once().then(…)``, then only after 1000ms of inactivity after the first trigger does the `js`.then()`` handler fire and the flow stops.

The `js`.once()`` method acts somewhat like a gatekeeper; it lets once trigger through, and tells all other triggers to just give up. Once the trigger that was let through reaches the end of the callback pipeline, the flow is stopped completely and cleaned.

It can also be useful to compare `js`.once()`` to `js`.until(() => true)``. The [`.until()`](/docs/flow/until/) method stops the flow whenever its callback returns something truthy, so at first glance this might seem similar to `js`.once()``. The main difference is that `js`.until()`` stops the flow right away, and does not let any triggers through to the rest of the callback pipeline. More specifically, `js`.once().then()`` allows the `js`.then()`` callback to run, whereas in `js`.until(() => true).then()``, triggers never get past the `js`.until()``.

### Awaiting flows

We can rewrite the image loading example using `js`await``, and make it (in a way) more sequential.

```js
const img = document.createElement('img');
await when(img).loads().once().after(() => {
	img.src = '/assets/img/mythical-beast.webp';
});
document.body.append(img);
```

Here, we use [`.after()`](/docs/flow/after/) to set the `js`.src`` property on the image. This is because it is not possible to set the `js`.src`` after the `js`await`` expression, since then the image never has something to load in the first place, and we can't set the `js`.src`` before attaching the event either, because the event might fire before the event listener was even set up (even if this is not actually possible - it feels unstable, and could be possible in other similar cases).

### Defer until connected

Some components could have heavy logic they need to run to instantiate. Sometimes, that logic can be deferred to when the component first connects to the DOM. For this, we can use `js`.once()`` in together with the [`connected()`](/docs/components/connected/) hook.

```yz
<title>complex-rendering</title>
<template mode="closed">
	<div id="render-container"></div>
</template>
<script>
const renderContainer = query('#render-container');

connected(() => {
	renderComplexThingIntoContainer(renderContainer);
	// …
}).once();
</script>
```

This causes the `js`connected()`` lifecycle to fire only once; when the component disconnects and connects again, this callback is no longer fired. Note that this does mean any event listeners set up inside the handler, or otherwise [monitorable](/docs/monitor/) items, are taken down immediately. Instead, if this is not desired, there's an alternative. Instead of stopping the flow returned by `js`connected()`` immediately after it triggers (which is what `js`.once()`` does), it can instead be stopped when the component disconnects through `js`.until(disconnected())``.

## Usage notes

Calling `js`.once()`` more than once on the same flow does nothing; only the first call is relevant to the behavior of the callback pipeline.

## See also

- [`Flow`](/docs/flow/)
- [`when()`](/docs/when/)
- [`until()`](/docs/flow/until/)
- [`if()`](/docs/flow/if/)
- [`debounce()`](/docs/flow/debounce/)
- [`connected()`](/docs/components/connected/)
