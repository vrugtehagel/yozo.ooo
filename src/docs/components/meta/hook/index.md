---
{
	"layout": "layouts/docs.liquid",
	"title": "<meta hook>",
	"description": "The \"hook\" meta tag allows for the exposure of advanced lifecycle callbacks such as `js`adopted()`` or `js`formReset()``."
}
---

:::info
**Note:** The `js`connected()`` and `js`disconnected()`` callbacks are included by default, and including them manually does nothing. Additionally, it is not possible to override their `attr`unhook`` callback.
:::

## Syntax

```yz
<meta hook="…">
<meta hook="…" unhook="…">
```

### Attributes

Note that the presence of the "hook" attribute on the [`<meta>`](/docs/components/meta/) tag is required for the following attributes to function.

`attr`hook``
: The name of the lifecycle callback to expose, excluding the trailing "Callback". For example, the native `js`.formResetCallback()`` method would be included through `yz`<meta hook="formReset">`` and exposed as `js`formReset()`` in the component's [`<script>`](/docs/components/script/) section.

`attr`unhook`` <mark>optional</mark>
: Optionaly, an "unhook" callback may be given. By default, the lifecycle callback passed to the `attr`hook`` attribute is chosen. Specifically this optional attribute exists to support `js`connected()`` and `js`disconnected()`` under the hood, although these lifecycle callbacks never have to be included explicitly. To put it bluntly, this attribute is currently not useful.

## Details

The `attr`hook`` attribute exposes the given lifecycle callback to the [`<script>`](/docs/components/script/) in a component definition. These hooks always create a monitored context for [type "undo"](/docs/monitor/undo/), which in practice means having to worry less about taking down event listeners and avoiding memory leaks. The monitored context is taken down whenever the callback itself fires again, or, if specified when the "unhook" fires; whichever comes first.

## Examples

### Adopting nodes

Let's start with a simple example by exposing the native `js`.adoptedCallback()``. We do this by specifying `attr`hook="adopted"``. Let's create a custom element that keeps track of the page's visibility, showing a log of timestamps for when the visibility changed.

```yz
<title>visibility-log</title>
<meta hook="adopted">
<template mode="closed">
	<ul>
		<li #for="log of $.logs">
			{{ log }}
		</li>
	</ul>
</template>
<script>
$.logs = []

adopted(() => {
	const owner = this.ownerDocument;
	when(owner).visibilitychanges().then(() => {
		const date = new Date();
		const timestamp = date.toLocaleString()
		const state = owner.visibilityState;
		const log = `${ state }: ${ timestamp }`;
		$.$logs.push(log);
	});
}).now();
</script>
```

If this element is to be moved from one document to another, we'll need the `js`adopted()`` callback to make sure the `str`visibilitychange`` listener is attached to the right document. Since every lifecycle callback creates a monitored context, the previous listener is taken down every time the `js`adopted()`` callback re-fires. Note that this example is prone to memory leaks; the element is attaching an event listener to a document and that is not cleaned up when the element disconnects from the document, for the purpose of being able to log these events even while the `tag`visibility-log`` element is not connected to its `js`ownerDocument``. This is not recommended, but is shown here for educational purposes.

### Form-related callbacks

When creating form-associated custom elements, we may also need form-related lifecycle callbacks, such as `js`formReset()``, `js`formStateRestore()``, or `js`formAssociated()``. To include these, just marking the element with [`<meta form-associated>`](/docs/components/meta/form-associated/) is not enough; to use the lifecycle callbacks, they need to be explicitly included using `yz`<meta hook="…">``. To demonstrate, let's create a read-only reset counter for our form. The custom element simply counts how many times the associated form has been reset. We can reset the counter using the (somewhat confusingly named) `js`formAssociated()`` hook, which fires whenever the custom element moves from one form to another.

```yz
<title>form-reset-counter</title>
<meta property="value" readonly>
<meta form-associated>
<meta hook="formReset">
<meta hook="formAssociated">
<template mode="closed">
	{{ $.value }}
</template>
<script>
const internals = this.attachInternals();

effect(() => {
	internals.setFormValue($.value);
});

formAssociated(() => {
	$.value = 0;
});

formReset(() => {
	$.value++;
});
</script>
```

Now, we can include it in forms, name it with the native `attr`name`` attribute, and its value will be included in the relevant form submissions.

## Usage notes

The arguments passed to lifecycle callbacks are identical to those of the native equivalents. For example, the native `js`.formAssociatedCallback()`` receives the new owner form as first argument; similarly, the function passed to `js`formAssociated()`` also receives this argument.

The `js`connected()`` and `js`disconnected()`` hooks cannot be overwritten with a different `attr`unhook`` callback. Specifying them in component definitions does nothing. Additionally, it is not possible to rename the callbacks.

While it is possible to include the `js`attributeChanged()`` lifecycle callback through `yz`<meta hook="attributeChanged">``, this is not generally necessary since it is equivalent to `js`when($.$attributes).change()``, and the latter provides additional granularity for each attribute through e.g. `js`when($.$attributes.$foo).changes()``. See [`<meta attribute>`](/docs/components/meta/attribute/) for more information.

## See also

- [`connected()`](/docs/components/connected/)
- [`disconnected()`](/docs/components/disconnected/)
- [`<script>`](/docs/components/script/)
- [`<meta form-associated>`](/docs/components/meta/form-associated/)
- [`<meta attribute>`](/docs/components/meta/attribute/)
- [`when()`](/docs/when/)
