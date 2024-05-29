---
{
	"layout": "layouts/docs.liquid",
	"title": "<meta hook>",
	"terms": "meta hook unhook lifecycle callback adopted form reset restore",
	"description": "The `hook`{attr} meta tag allows for the exposure of advanced lifecycle callbacks such as `adopted()`{js} or `formReset()`{js}."
}
---

:::info
**Note:** The `connected()`{js} and `disconnected()`{js} callbacks are included by default, and including them manually does nothing. Additionally, it is not possible to override their `unhook`{attr} callback.
:::

## Syntax

```yz
<meta hook="…">
<meta hook="…" unhook="…">
```

### Attributes

Note that the presence of the "hook" attribute on the [`<meta>`](/docs/components/meta/) tag is required for the following attributes to function.

`hook`{attr}
: The name of the lifecycle callback to expose, excluding the trailing "Callback". For example, the native `.formResetCallback()`{js} method would be included through `<meta hook="formReset">`{yz} and exposed as `formReset()`{js} in the component's [`<script>`](/docs/components/script/) section.

`unhook`{attr} <mark>optional</mark>
: Optionaly, an "unhook" callback may be given. By default, the lifecycle callback passed to the `hook`{attr} attribute is chosen. Specifically this optional attribute exists to support `connected()`{js} and `disconnected()`{js} under the hood, although these lifecycle callbacks never have to be included explicitly. To put it bluntly, this attribute is currently not useful.

## Details

The `hook`{attr} attribute exposes the given lifecycle callback to the [`<script>`](/docs/components/script/) in a component definition. These hooks always create a monitored context for [type "undo"](/docs/monitor/undo/), which in practice means having to worry less about taking down event listeners and avoiding memory leaks. The monitored context is taken down whenever the callback itself fires again, or, if specified when the "unhook" fires; whichever comes first.

## Examples

### Adopting nodes

Let's start with a simple example by exposing the native `.adoptedCallback()`{js}. We do this by specifying `hook="adopted"`{attr}. Let's create a custom element that keeps track of the page's visibility, showing a log of timestamps for when the visibility changed.

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

If this element is to be moved from one document to another, we'll need the `adopted()`{js} callback to make sure the `visibilitychange`{str} listener is attached to the right document. Since every lifecycle callback creates a monitored context, the previous listener is taken down every time the `adopted()`{js} callback re-fires. Note that this example is prone to memory leaks; the element is attaching an event listener to a document and that is not cleaned up when the element disconnects from the document, for the purpose of being able to log these events even while the `visibility-log`{tag} element is not connected to its `ownerDocument`{js}. This is not recommended, but is shown here for educational purposes.

### Form-related callbacks

When creating form-associated custom elements, we may also need form-related lifecycle callbacks, such as `formReset()`{js}, `formStateRestore()`{js}, or `formAssociated()`{js}. To include these, just marking the element with [`<meta form-associated>`](/docs/components/meta/form-associated/) is not enough; to use the lifecycle callbacks, they need to be explicitly included using `<meta hook="…">`{yz}. To demonstrate, let's create a read-only reset counter for our form. The custom element simply counts how many times the associated form has been reset. We can reset the counter using the (somewhat confusingly named) `formAssociated()`{js} hook, which fires whenever the custom element moves from one form to another.

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

Now, we can include it in forms, name it with the native `name`{attr} attribute, and its value will be included in the relevant form submissions.

## Usage notes

The arguments passed to lifecycle callbacks are identical to those of the native equivalents. For example, the native `.formAssociatedCallback()`{js} receives the new owner form as first argument; similarly, the function passed to `formAssociated()`{js} also receives this argument.

The `connected()`{js} and `disconnected()`{js} hooks cannot be overwritten with a different `unhook`{attr} callback. Specifying them in component definitions does nothing. Additionally, it is not possible to rename the callbacks.

While it is possible to include the `attributeChanged()`{js} lifecycle callback through `<meta hook="attributeChanged">`{yz}, this is not generally necessary since it is equivalent to `when($.$attributes).change()`{js}, and the latter provides additional granularity for each attribute through e.g. `when($.$attributes.$foo).changes()`{js}. See [`<meta attribute>`](/docs/components/meta/attribute/) for more information.

Hooks defined with an unhook retroactively call their callback if the `hook`{js} itself was called but the `unhook`{attr} was not yet. In the case of `connected()`{js}, when calling `connected()`{js} while the element is already connected to the DOM, the callback runs immediately. On the other hand, when defining a hook without an unhook, this does not happen; the hook only fires for future calls of the hook in question, regardless of whether or not it has fired before.

## See also

- [`connected()`](/docs/components/connected/)
- [`disconnected()`](/docs/components/disconnected/)
- [`<script>`](/docs/components/script/)
- [`<meta form-associated>`](/docs/components/meta/form-associated/)
- [`<meta attribute>`](/docs/components/meta/attribute/)
- [`when()`](/docs/when/)
