---
{
	"layout": "layouts/docs.liquid",
	"title": "#for…of",
	"terms": "reactive inline for loop while iterate component template dynamic list item",
	"description": "The `#for=\"… of …\"`{yzattr} construct allows for generating lists of elements easily within the template itself."
}
---

Note that this syntax applies only within the [`<template>`](/docs/components/template/) section of [components](/docs/components/).

## Syntax

```yz
<element #for="item of iterable">…</element>
<template #for="item of iterable">…</template>
```

### Parameters

`iterable`{js}
: An array or otherwise iterable object to iterate over.

`item`{js}
: The items in the iterable. This must _not_ include an initializer, meaning there should be no `var`{js}, `let`{js} or `const`{js}. The `item`{js} variable is then available in the element's subtree as well as the other attributes on the element itself. This means all descendants also have access to the `item`{js} variable, including [`{{ inline }}`](/docs/components/template/inline/) expressions.

`<element>`{yz}
: Any element. It and its subtree are generated once for every `item`{js} in the iterable. If this element is the `<template>`{yz} element, then only the children are generated for every `item`{js} (not the `<template>`{yz} itself).

:::info
**Note:** Only `#for="… of …"`{yzattr} expressions are supported. While the `for(initializer; condition; incrementer)`{js} form of for-loops is not supported, one may achieve the same goal by generating the array of iterated items before looping, and assigning it to a key in the component state object [`$`](/docs/components/$/).
:::

## Details

For simple cases, `#for="… of …"`{yzattr} behaves just like one might expect; it iterates over the iterable, and generates elements for each item. Unlike some other frameworks, Yozo does not need a `key`{attr} attribute to keep track of which item is which. In classic Yozo fashion, this sacrifices some performance for simplicity and ease-of-use. However, Yozo does try to optimize things somewhat; for example, if the iterable triggers a re-render, items that did not change in value are not recomputed.

## Examples

### Generating list items
First, let's have a look at a basic example. We'll define a list of different drinks in our [`<script>`](/docs/components/script/) section, which we'll then render in a classic unordered list (`<ul>`{yz}). Note that the repeating element is the `<li>`{yz}, i.e. the list items themselves, so we'll need to put the `#for`{attr} attribute on the list items.

```yz
<title>drinks-list</title>
<template mode="closed">
	<ul>
		<li #for="drink of $.drinks">
			{{ drink }}
		</li>
	</ul>
</template>
<script>
$.drinks = ['water', 'tea', 'coffee', 'soda'];
</script>
```

When the `$.drinks`{js} array updates, then so will the list.

### Objects vs primitives

In the previous example, our array contained primitives. In that case, iterating the array directly is fine. However, if our array contains objects, then iterating the items directly means we're losing the reactivity that they might have. To get around this, iterate over a [live](/docs/live/) variable, instead of its plain value:

```yz
<title>drinks-list</title>
<template mode="closed">
	<ul>
		<li #for="$drink of $.$drinks">
			{{ $drink.name }}
		</li>
	</ul>
</template>
<script>
$.drinks = [{ name: 'water' }, { name: 'tea' } /* , … */];
</script>
```

Just like when accessing deeper properties on live variables, we'll want to keep the entire accessing chain live until the very last property access. In the case of `#for="… of …"`{yzattr}, that means iterating over live items whenever the items are objects.

### Combining with #if

Sometimes, we might conditionally render a list of items, or have certain conditions on each item of a list. Unfortunately, attribute order is not guaranteed, and so writing `#for="…"`{yzattr} and `#if="…"`{yzattr} on the same element is ambiguous. Instead, split the attributes over two elements; one may be a `<template>`{yz} element, which, when used with a logical (`#`{attr}-prefixed) attribute, renders its children. For example, to render list items conditionally:

```yz
<title>healthy-drinks</title>
<template mode="closed">
	<ul>
		<template #for="drink of $.drinks">
			<li #if="$.isHealthy(drink)">{{ drink }}</li>
		</template>
	</ul>
</template>
<script>
$.drinks = ['water', 'tea', 'coffee', 'soda'];
$.isHealthy = drink => { /* … */ };
</script>
```

Alternatively, to set a condition on whether or not to render a list might look something like

```yz
<title>drinks-and-fuels</title>
<template mode="closed">
	<ul>
		<template #if="$.showDrinks">
			<li #for="drink of $.drinks">
				{{ drink }}
			</li>
		</template>
		<template #else>
			<li #for="fuel of $.fuels" class="fuel">
				{{ fuel }}
			</li>
		</template>
</template>
<script>
$.drinks = ['water', 'tea', 'coffee', 'soda'];
$.fuels = ['petrol', 'hydrogen'];
</script>
```

Note that while it is possible to use `<template>`{yz} wrappers for `#for`{attr} expressions regardless of whether or not they are necessary, it is more performance-friendly to avoid this and use `#for`{attr} on the elements themselves.

## Usage notes

In situations where there's a need to render a lot of elements (e.g. several hundreds) or there's an otherwise performance-sensitive situation, it may be desirable to manage list rendering manually using an [`effect()`](/docs/effect/).

## See also

- [`<template>`](/docs/components/template/)
- [`#if-else`](/docs/components/template/if-else/)
- [`$`](/docs/components/$/)
- [Live variables](/docs/live/)
