---
{
	"title": "<meta form-associated>",
	"terms": "meta form associated custom input control",
	"description": "The `form-associated`{attr} meta tag declares that a component is a custom form control. This allows it to participate in `<form>`{html} elements."
}
---

## Syntax

```yz
<meta form-associated>
```

### Attributes

This meta tag has no additional attributes beyond it main attribute.

`form-associated`{attr}
: A boolean attribute. If it is present, the component is marked to participate in native forms.

## Details

The native equivalent of this meta tag is setting the `static formAssociated`{js} property to `true`{js} on the element's definition class. When writing `form-associated`{attr} elements, the provided [`internals`](/docs/components/internals/) variable allows for setting the internal form value (through `.setFormValue()`{js}), setting its validity (using `.setValidity()`{js}) and a whole range of other methods and properties. To learn more about `ElementInternals`{js}, see [ElementInternals on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals).

## Examples

### Number input

Let's write a custom number input element. We'll use a regular `<input>`{yz} element (with `type="text"`{attr}) for the input. Then, we'll expose its value through a `value`{attr} attribute with an accompanying `.value`{js} property. When the text input by the user is not a number (i.e. converts to `NaN`{js}), then we'll say the value is `0`{js} and mark the input as invalid. Of course, to make it all work in `<form>`{html} elements, we'll need to mark it with `<meta form-associated>`.

```yz
<title>number-input</title>
<meta attribute="value" type="number">
<meta form-associated>
<template mode="closed" delegates-focus="true">
	<input type="text">
</template>
<script>
const input = query('input');
input.value = $.value;
live.link($.$text, input);
live.link($.$isValid, () => !isNaN($.text));
live.link($.$value, () => Number($.text) || 0);

effect(() => {
	internals.setFormValue($.value);
});

effect(() => {
	if($.isValid){
		internals.setValidity({});
		return;
	}
	const flags = { typeMismatch: true };
	const message = 'Must be a number';
	internals.setValidity(flags, message);
});
</script>
```

Now, our `<number-input>`{html} element may participate in forms, using the global `name`{attr} attribute. It will also respond to users attempting to submit an invalid value for the `<number-input>`{html}. For component libraries, it's often a good idea to include properties exposed to native form controls, such as `.form`{js}, `.validity`{js}, and `.willValidate`{js}, which may just be getters proxying the `ElementInternals`{js}, and a `.name`{js} property for the global `name`{attr} attribute.

## See also

- [`<meta>`](/docs/components/meta/)
- [`<meta attribute=…>`](/docs/components/meta/attribute/)
- [`<meta property=…>`](/docs/components/meta/property/)
- [ElementInternals on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals)
