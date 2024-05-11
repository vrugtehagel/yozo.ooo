---
{
	"layout": "layouts/docs.liquid",
	"title": "Inline expressions",
	"description": "Substitute text into component templates using double curly braces, from simple variables to complex expressions."
}
---

## Syntax

```js
{{ expression }}
```

### Parameters

`expression`{js}
: Any JavaScript expression, usually one containing live variables such as those under the component's state variable [`$`](/docs/components/$/). The rendered text is updated when its live dependencies change.

## Details

While the expression supports any amount of complexity (as long as it is a single expression), there is one single limitation; the expression may not itself contain the literal string `}}`{js}. This is because it would close the `{{ inline }}`{yz} expression early. To avoid `}}`{js}, either use `} }`{js} if it is not inside a string, or escape it with its hexadecimal equivalent `'\x7d'`{js}.

Every inline expression is updated when its live dependencies change, independent of whether or not there are multiple `{{ inline }}`{yz} expressions in a single text node. Expressions are not updated while the component in question is disconnected from the DOM. If this is needed, use an [`effect()`](/docs/effect/) to handle the updates manually.

## Examples

### Hi earth!

Let's create a minimal component that renders a greeting and a receiver. We'll pass these as a `greeting`{attr} and `receiver`{attr} attribute respectively (using [`<meta attribute>`](/docs/components/meta/attribute/)). We then render each with an `{{ inline }}` expression.

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

## See also

- [`<template>`](/docs/components/template/)
- [`$`](/docs/components/$/)
- [`effect()`](/docs/effect/)
