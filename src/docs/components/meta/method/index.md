---
{
	"layout": "layouts/docs.liquid",
	"title": "<meta method>",
	"description": "The \"method\" meta tag defines a single method, to be exposed on the defined custom element."
}
---

Methods are always read-only; otherwise, use [`<meta property>`](/docs/components/meta/property/). One `<meta method=…>`{yz} declaration always defines one method. To add multiple, use multiple declarations.

:::info
**Note:** If the purpose is to pass data to a component, using one or more [properties](/docs/components/meta/property/) is usually a more ergonomic choice. This is because it is not possible to call methods inside of a component's [`<template>`](/docs/components/template/), whereas there is a shorthand for [`.properties`](/docs/components/template/properties/).
:::

## Syntax

```yz
<meta method="…">
```

### Attributes

`method`{attr}
: The name of the method. The implementation is looked up under the same name on the component's state variable [`$`](/docs/components/$/).

## Examples

### Content-reverser

In this example, we'll be building a component that can reverse its text contents. For simplicity we'll assume it only ever contains text. For the reversing, we'll implement a `.reverse()`{js} method on the component's state variable [`$`](/docs/components/$/), and declare it as exposed method using `<meta method=…>`{yz}.

```yz
<title>content-reverser</title>
<meta method="reverse">
<script>
$.reverse = () => {
	const content = this.textContent;
	const reversed = [...content].reverse().join('');
	this.textContent = content;
};
</script>
```

Now, given a reference `element`{js} to a certain `<content-reverser>`{html} element, we can call `element.reverse()`{js} to flip its text contents around. Note that we cannot reassign `element.reverse`{js} (at least not from outside of the component definition).

## Usage notes

While methods defined through `<meta method>`{yz} should always be functions, technically they are equivalent to defining a [`<meta property>`](/docs/components/meta/property/) with the `readonly`{attr} attribute. Also note that while they are readonly from the perspective of someone using the component, the component definition might alter the exposed function implementation. However, this is not advised, since authors might not expect a method to change over time.

There is no distinction between synchronous and asynchronous methods; the definition on `$`{js} is essentially forwarded as-is. If desired methods may be marked asynchronous in their declaration using `<meta async method=…>`{yz} in order to provide better first-glance documentation, however this does not have any functional effect. The `async`{attr} attribute is merely cosmetic, so synchronous functions do not get turned into asynchronous ones regardless of the attribute.

Methods are implicitly ignored with [`monitor.ignore()`](/docs/monitor/ignore/), so calling a component method cannot contribute to monitored contexts such as [`effect()`](/docs/effect/) or [`connected()`](/docs/components/connected/). This is because Yozo is designed to be a drop-in yet understandable framework; authors using components should not have to know anything about live variables or monitored contexts if they are not directly using Yozo themselves.

## See also

- [`<meta property>`](/docs/components/property/)
- [`$`](/docs/components/$/)
- [`<meta>`](/docs/components/meta/)
- [components](/docs/components/)
