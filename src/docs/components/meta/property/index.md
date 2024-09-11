---
{
	"title": "<meta property>",
	"terms": "meta propert expose readonly state",
	"description": "The \"property\" meta tag defines a single property to be exposed on the custom element. It may optionally be marked read-only."
}
---

:::info
**Note:** To create a property reflecting an attribute, see [`<meta attribute>`](/docs/components/meta/attribute/).
:::

To add multiple properties, use multiple `<meta property=…>`{yz} declarations.

## Syntax

```yz
<meta property="…">
<meta property="…" readonly>
```

### Attributes

The presence of the `property`{attr} attribute on the [`<meta>`](/docs/components/meta/) tag is required for the following attributes to function.

`property`{attr}
: The name of the property in question. This name is also used to look up the property's value in the component state variable [`$`](/docs/components/$/). It is used as-is; no case conversion happens.

`readonly`{attr} <mark>optional</mark>
: Marks the property as read-only. This prevents it from being set through the property on the custom element, but component logic is still free to alter the corresponding property on `$`{js}. In other words: the component's internals may set the value, but outside code is prevented from changing it (and will throw an error if attempted).

## Examples

### Attribute-less

Theoretically, if setting values through markup is not required for a component, attributes can be replaced by a property. For the component definition, there's often not much of a difference; the main difference is initializing a value. Specifying an initial value is often not necessary for attributes due to the `type`{attr} attribute, and can be done through configuring [`<meta attribute>`](/docs/components/meta/attribute/) with a `default`{attr} attribute if needed. Properties need to define their initial value in the `<script>`{yz} section. For example, we might define the `<click-counter>`{html} component with an `.amount`{js} property (instead of an attribute):

```yz
<title>click-counter</title>
<meta property="amount">
<template mode="closed">
	<button @click="$.amount++">
		Click count: {{ $.amount }}
	</button>
</template>
<script>
$.amount = 0;
</script>
```

Since the `.amount`{js} property is looked up on the component's state variable [`$`](/docs/components/$/), we can use it like any other live variable inside the component. This also means the component reacts to changes coming from outside the internal logic. If we wanted to disable that behavior, disallowing authors from setting the `.amount`{js} property, but still allowing them to read it, we add the `readonly`{attr} attribute to the `<meta property=…>`{yz} tag. The component may still update `$.amount`{js} internally, so the click counter button keeps working just fine, but is then protected from any external changes.

### Non-live

Occasionally, there is a need to "proxy" a value through a property on a custom element. For example, we might have a form-associated custom element, where we want to expose the `.labels`{js} property on the [`internals`](/docs/components/internals/) object as a property, just like regular form elements. It is not possible to use `$` here, because there is no sensible way of binding a live variable to `internals.labels`{js}; there is no trigger available to update such a live variable whenever `internals.labels`{js} changes value, and so we cannot reliably keep them in-sync. Instead, a manual property should be defined on the component itself, that is, on the `this`{js} value.

```yz
<title>some-form-element</title>
<meta property="labels" readonly>
<meta form-associated>
<script>
Object.defineProperty(this, 'labels', {
	get: () => internals.labels
})
</script>
```

Theoretically, it does not need to be declared as `readonly`{attr} if we define it through `Object.defineProperty()`{js}. In fact, technically it doesn't need to be declared at all; however, it is recommended to still do both in order to make it easier to see what properties a component defines at a glance.

## Usage notes

If the property in question is a function, and if it is readonly, then potentially [`<meta method>`](/docs/components/meta/method/) might be a better fit.

The generated property getter exposed on the custom element never returns a live variable, nor does usage contribute to monitored contexts such as [`effect()`](/docs/effect/). This is by design; even though Yozo is (by definition) loaded in contexts where a Yozo component is defined, the outside environment should not assume other authors are using it. This allows components to be more drop-in, as well as being easier to understand.

It is advised to keep settable properties simple in terms of data type. For optimal ease-of-use, properties should be a primitive value, such as a number, string, or boolean. If the value is an object, then the live variable for the property does not trigger change events for nested changes, because the properties never return a live variable.

## See also

- [`<meta>`](/docs/components/meta/)
- [`<meta attribute>`](/docs/components/meta/attribute/)
- [`<meta method>`](/docs/components/meta/)
- [`$`](/docs/components/$/)
- [components](/docs/components/)
