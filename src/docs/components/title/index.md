---
{
	"layout": "layouts/docs.liquid",
	"title": "<title>",
	"description": "The only required element in a component definition file is the `yz`<title>`` element; it defines the name for your custom element."
}
---

## Syntax

```yz
<title>custom-element-name</title>
```

### Parameters

`yz`custom-element-name``
: The name for the custom element. This must conform to the rules for custom element names, which means it should start with an alphabetic character (a-z) and include a dash, but is otherwise very free in what is allowed. For usability however it is recommended to use alphanumeric characters (including dashes and underscores) only.

### Attributes

The `yz`<title>`` element does not accept any attributes.

## Details

The `yz`<title>`` element is the only required element in component definition files. It determines the name for the custom element; essentially, its text contents are directly passed as first argument to the native `js`customElements.define()``. That also means it _most not_ contain whitespace, including newlines and indentation. Providing multiple title elements is not an error, though any `yz`<title>`` element after the first one is ignored.

## Examples

### Bare necessities

Theoretically, even though the element would do nothing, the following would be a valid component definition:

```yz
<title>defined-element</title>
```

This would define a custom element `html`<defined-element>``. In terms of the native [custom elements API](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements), this component (when registered using [`register()`](/docs/register/) would be equivalent to

```js
customElements.define('defined-element', class extends HTMLElement {});
```

In other words; it does nothing beyond what a non-defined custome element does, although registering it allows it to be selected using the native `sel`:defined`` pseudo-class. Additionally, registering it prevents it from being registered again by another component definition, although protecting a custom element name in this manner is not advised.

Custom elements can not be un-registered. Once an element has been defined, it is not removable and will always remain defined. It is, however, upgradeable using `js`customElements.upgrade()``, though this is not currently possible through Yozo and therefore not is recommended.

## See also

- [components](/docs/components/)
- [`register()`](/docs/register/)
- [`<meta>`](/docs/components/meta/)
- [`<template>`](/docs/components/template/)
- [`<script>`](/docs/components/script/)
- [`<style>`](/docs/components/style/)
