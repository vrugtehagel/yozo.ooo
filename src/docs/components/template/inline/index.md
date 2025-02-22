---
{
	"title": "Inline expressions",
	"terms": "inline expression text node double curly brace moustache dynamic reactive",
	"description": "Substitute text or DOM nodes into component templates using double curly braces, using anything from simple variables to complex expressions."
}
---

## Syntax

```js
{{ expression }}
```

### Parameters

`expression`{js}
: Any JavaScript expression, usually one containing live variables such as those under the component's state variable [`$`](/docs/components/$/). The resulting value can be either a string or a DOM node; anything else will be converted into a string. The substituted string or node is updated whenever the expression's live dependencies change.

:::info
**Note:** When substituting DOM nodes directly, it is not possible to substitute `DocumentFragment`{js} objects. Instead, retrieve the specific node that must be rendered, e.g. through `fragment.firstElementChild`{js}.
:::

## Details

While the expression supports any amount of complexity (as long as it is a single expression), there is one single limitation; the expression may not itself contain the literal string `}}`{js}. This is because it would close the `{{ inline }}`{yz} expression early. To avoid `}}`{js}, either use `} }`{js} if it is not inside a string, or escape it with its hexadecimal equivalent `'\x7d'`{js}.

Every inline expression is updated individually when its live dependencies change, even if there are multiple `{{ inline }}`{yz} expressions in a single text node. Expressions are not updated while the component in question is disconnected from the DOM. If this is needed, use an [`effect()`](/docs/effect/) to handle the updates manually.

## Examples

### Hi earth

Let's create a minimal component that renders a greeting and a receiver of said greeting. We'll pass these as a `greeting`{attr} and `receiver`{attr} attribute respectively (using [`<meta attribute>`](/docs/components/meta/attribute/)). We then render each with an `{{ inline }}` expression.

```yz
<title>greet-me</title>
<meta attribute="greeting" type="string">
<meta attribute="receiver" type="string">
<template mode="closed">
	{{ $.greeting }}, {{ $.receiver }}!
</template>
```

Now, if we use this component like

```html
<greet-me greeting="hi" receiver="earth"></greet-me>
```

Then the component renders "hi earth!" - additionally, when the attributes change, then the text rendered is automatically updated as well.

### Element substitution

In certain scenarios, such as when using a third-party library, we might get a reference to an HTML element node, and we may need to render it into a component. For example, say we are using a charting library that transforms a certain dataset into an SVG for a nice-looking chart. We could then use `{{ inline }}`{yz} expressions like so:

```yz
<title>fancy-chart</title>
<meta attribute="caption" type="string">
<meta property="chartData">
<template mode="closed">
	<figure>
		{{ $.chart }}
		<figcaption>{{ $.caption }}</figcaption>
	</figure>
</template>
<script>
connected(() => {
	effect(() => {
		const svg = fancyChartLib.renderSVG(chartData);
		$.chart = svg;
	});
});
</script>
```

While the caption is a simple string, the `$.chart`{js} is an SVG element; but we substitute them all the same. Keep in mind that, since the substituted element is not cloned, altering its contents results in direct changes to the rendered DOM. As soon as the `$.chart`{js} variable is updated to a new element, however, then the old one is discarded and the new chart element is rendered.

## See also

- [`<template>`](/docs/components/template/)
- [`$`](/docs/components/$/)
- [`effect()`](/docs/effect/)
