---
{
	"title": "internals",
	"terms": "internals attach element aria form associated shadow root state",
	"description": "The `internals`{js} variable exposes an element's `ElementInternals`{js} and is available within a component's `<script>`{yz} and `<template>`{yz} sections."
}
---

This article does not extensively cover the functionality of `ElementInternals`{js}. For more information, see [ElementInternals on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals).

## Syntax

```js
internals
```

:::warning
**Warning:** Older versions of Safari may not support `ElementInternals`. For those browsers, the value of `internals`{js} is `undefined`{js}. If support for those browsers is needed, use a [polyfill](https://unpkg.com/element-internals-polyfill).
:::

## Details

The `internals`{js} variable is available within a component's [`<script>`](/docs/components/script/) section and within logic inside the [`<template>`](/docs/components/template/). It is primarily used for retrieving a reference to the shadow root, handling internals for form elements, and keeping track of custom element states. It may also be used to manually control aria properties, though this is an advanced use-case; often times it is better not to alter aria behavior at all rather than doing so incorrectly.

## Examples

### Shadow root

The `ElementInternals`{js} for custom elements hold a reference to the shadow root, whether it is open or closed. This is the recommended way of retrieving a reference to the shadow.

```yz
<title>declare-shadow-mode</title>
<template mode="closed">
	My shadow is {{ $.mode }}
</template>
<script>
$.mode = internals.shadowRoot.mode;
</script>
```

This component, when used, prints "My shadow is closed". It is also possible to directly use `internals` inside the template, like so:

```yz
<title>declare-shadow-mode</title>
<template mode="closed">
	My shadow is {{ internals.shadowRoot.mode }}
</template>
```

And this is functions the same as the previous snippet.

### Form elements

Besides retrieving a shadow root, element internals are most useful when creating form-associated custom elements. To create a form-associated custom element, first it must be marked as such using [`<meta form-associated>`](/docs/components/meta/form-associated/). Then, we can use native `ElementInternals`{js} method such as `.setFormValue()`{js} or `.reportValidity()`{js}. Let's now look at an example of a `required-input`{tag} component. We'll get it to function like an `<input required>`{html}, but without using the `required`{attr} attribute.

```yz
<title>required-input</title>
<meta attribute="value" type="string">
<meta attribute="name" type="string">
<meta property="form">
<meta form-associated>
<template mode="closed">
	<input type="text">
</template>
<script>
const input = query('input');
live.link($.$value, input);
live.link($.$isValid, () => $.value.length > 0);
effect(() => {
	internals.setFormValue($.value);
});
effect(() => {
	if($.isValid){
		internals.setValidity({});
	} else {
		const message = 'This field is required';
		const flags = ???;
		internals.setValidity(flags, message);
	}
});
</script>
```

To avoid re-setting the validity unnecessarily, we create an `$.isValid`{js} variable reflecting whether or not the `required-input`{tag} passes validation. Declaring the `name` attribute is not technically necessary, since forms read the names from the attributes regardless, but it is recommended to mimic the attribute-property pair that native form elements have for consistency.

### No reactivity

Properties under `internals`{js} are _not_ live. Therefore, properties under `internals`{js} do not respond to changes, not when used inside the [`<template>`](/docs/components/template/) nor when used inside an [`effect()`](/docs/effect/) or a [`live.link()`](/docs/live/link/). Instead, if reactivity is desired, a live variable must be manually created and bound to the corresponding property under `internals`{js}. In this example, we'll create a component that can hide text for screen readers using a boolean `hide`{attr} attribute. Since we declare this attribute through [`<meta attribute>`](/docs/components/meta/attribute/), the element's `.hide`{js} property reflects the presence of the attribute. Thus, we may bind `$.hide`{js} to `internals.ariaHidden`{js} through a `live.link()`{js} like so:

```yz
<title>aria-hideable-text</title>
<meta attribute="hide" type="boolean">
<script>
live.link($.$hide, {
	get: () => internals.ariaHidden,
	set: value => internals.ariaHidden = value.toString()
});
</script>
```

Note that this does _not_ automatically synchronize changes done to `.ariaHidden`{js}; instead, we use the live variable, which keeps them in-sync at all times.

## See also

- [`<meta form-associated>`](/docs/components/meta/form-associated/)
- [`<script>`](/docs/components/script/)
- [`<meta>`](/docs/components/meta/)
- [ElementInternals on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
