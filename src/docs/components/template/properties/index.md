---
{
	"layout": "layouts/docs.liquid",
	"title": ".property",
	"terms": "dynamic property shorthand inline component template bind reactive expression period nest chain",
	"description": "Bind reactive computations to elements inside the component's `<template>`{yz} by using property-like syntax as attributes."
}
---

## Syntax

```yz
<element .property="expression"></element>
<element .nested.property="expression"></element>
```

### Parameters

`.property`{attr}
: A property or property chain to bind to. The properties written in the attribute are converted from kebab-case to camelCase before being accessed as properties.

`expression`{js}
: An expression to which to set the property, usually one with [live](/docs/live/) dependencies.

## Details

Because attributes are case-insensitive, the property syntax converts properties from kebab-case to camelCase. For example, to dynamically update an element's `.textContent`{js} (without using an [`{{ inline }}`](/docs/components/template/inline/) expression), we would write `.text-content=…`{attr}. This does create a somewhat awkward situation for abbreviations in property names, most notably `.innerHTML`{js}, since they contain multiple uppercase characters in a row. Instead of writing `.inner-html=…`{attr}, which is what one might expect, we'd need `.inner-h-t-m-l=…`{attr}.

The syntax also allows nested properties, such as `.style.color=…`{attr}. The entire property chain is re-accessed every update. This behavior even allows for expressions that affect other elements; for example, `.first-child.style.color=…`{attr} would translate to dynamically setting `.firstChild.style.color`{js}, causing updates to an element's child instead of the element itself. It is not recommended to do this, however, because it becomes harder to find what exactly happens where, impacting maintainability.

The properties set with this in-template syntax update dynamically when one or more live dependencies change, but not while the component is disconnected from the DOM. If this is necessary, manually set the property using an [`effect()`](/docs/effect/).

## Examples

### Boolean attributes

One of the main use cases for the property syntax is in combination with boolean attributes such as `hidden`{attr}. Using the [`:attribute`](/docs/components/template/attributes/) syntax is often awkward because the expression would need to compute to `null`{js} (for removing the attribute) and `''`{js} (to include it). With the property syntax, we can let the expression evaluate to a boolean, which often ends up being more succinct and readable.

For the example, let's write a `<toggle-me>`{html} element with a `visibility`{attr} attribute. To make things a bit more complex for the sake of the example, we'll let the `visibility`{attr} attribute be a string and accept `"visible"`{str} and `"hidden"`{str}, similar to the `visibility`{css} CSS property.

```yz
<title>toggle-me</title>
<meta attribute="visibility" type="string">
<template mode="closed">
	<div class="content" .hidden="$.visibility == 'hidden'">
		<slot></slot>
	</div>
</template>
```

With `:attribute`{attr} syntax, we would need a ternary to turn the boolean into `null`{js} and `''`{js}. Note that the syntax even allows for things like `.first-child.hidden=…`{attr} to show and hide the `<slot>`{yz}, though it is advised to keep the expressions on-node and relatively simple for maintainability.

### Inline styles

The nested property syntax is especially handy for inline styles. While inline styles are generally to be discouraged for their strong specificity in CSS, sometimes they're the most straight-forward choice. And in templates with a shadow root, styles are scoped, suppressing some of the issues with the specificity. Since the using an element's `.style`{js} property requires us to convert CSS properties to camelCase (e.g. `.style.fontSize = …`{js}), to use them with the `.property`{attr} syntax, we go full circle, back to the traditional kebab-case CSS properties (like `.style.font-size=…`{attr}).

For the example, we create a `<colored-text>`{html} component that receives two optional attributes, `color`{attr} (for the text) and `bgcolor`{attr}. The component then renders its contents with the specified text color and background color.

```yz
<title>colored-text</title>
<meta attribute="color" type="string" default="black">
<meta attribute="bgcolor" type="string" as="bgColor" default="transparent">
<template mode="closed">
	<span
		.style.color="$.color"
		.style.background-color="$.bgColor"
	>
		<slot></slot>
	</span>
</template>
```

Note how the syntax allows us to set the properties separately; if we were to use a `:style=…`{attr} expression, we would need to bundle both properties into the same expression.

## See also

- [`:attribute`](/docs/components/template/attribute/)
- [live](/docs/live/)
- [`effect()`](/docs/effect/)
- [`<template>`](/docs/components/template/)
- [`components`](/docs/components/)
