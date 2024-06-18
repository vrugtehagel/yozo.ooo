---
{
	"title": "What is shadow DOM?",
	"date": "2024-06-16",
	"description": "Shadow DOM allows authors to attach DOM trees to elements, providing encapsulation for markup, styles and even JavaScript.",
	"terms": "shadow dom web components encapsulation tutorial help learn blog post"
}
---

:::info
**Note:** This article assumes a basic understanding of HTML, CSS and JavaScript and specifically the (regular) Document Object Model.
:::

## Introduction

Most HTML elements are "boxes" for their children. They perhaps have some semantic differences, but ultimately we can make a `<section>`{html} behave like a `<b>`{html} element through CSS if we wanted to; there's no fundamental difference between them. Some HTML elements, however, have special behavior; for example, a `<video>`{html} element, an `<iframe>`{html}, `<input>`{html} or even a `<canvas>`{html}. These elements have behaviors that are not achieveable by styles alone.

Web components allow authors to create elements like those. Elements that are unaffected by what's happening around them. The key to making this possible is _shadow DOM_.

## Overview

A <dfn>shadow DOM</dfn> essentially changes the way an element renders. Once it has a shadow DOM, it no longer renders its children like "normal" HTML elements do. Instead, it renders the markup inside the shadow DOM.

Now, let's say we want a toggle switch. The native `<input type="checkbox">`{html} is not cutting it; it renders a checkbox, and we can't do much about that in terms of styling. That's when shadow DOM comes in handy; we can create the HTML and CSS necessary to render a toggle switch, insert that into the shadow DOM of an element (usually a custom element), and voilà! We've got the toggle switch we wanted.

The difference between this, and just inserting that HTML and CSS into a regular HTML element, is that shadow DOM provides encapsulation. The elements outside of the shadow DOM cannot "see" the elements in the shadow, and neither can styles. Styles outside of the shadow DOM do not affect elements inside it and vice versa. This is great, because it means neither relies on implementation details of the other. If we have a `.thumb`{sel} class in our shadow DOM, and we happen to have an image gallery with `.thumb`{sel} elements outside of the shadow as well, then the styles for either do not affect the other. This encapsulation is perfect for reusability.

## Creating a shadow

To create a shadow, we call the `.attachShadow()`{js} method on an element, or use the declarative syntax. Let's choose the latter for now. Then, let us attach a shadow to a regular `<div>`{html} element:

```html
<div id=shadow-host>
	<template shadowrootmode="closed">
		<p>I live in the shadow of my ancestor.</p>
	</template>
	<p>I am a regular child!</p>
</div>
```

The `<div>`{html} element has now gotten a shadow. We'll get to what the "mode" is a bit later; let's first get some terminology out of the way.

The <dfn>shadow host</dfn> is the element that the shadow is attached to. In this case, the `<div>`{html} is the shadow host.

The <dfn>shadow tree</dfn> is the markup inside the shadow. In this example, that consists of a paragraph element with some text inside it.

The <dfn>shadow root</dfn> is the root node of the shadow DOM. It is not an `Element`{js}, but an object inheriting from `DocumentFragment`{js}. This node is not part of the same DOM tree as the shadow host, but is nevertheless attached to (associated with) the shadow host. This allows the shadow to render arbitrary content in complete isolation.

<!-- Sometimes, the DOM that is not inside a shadow root is referred to as <dfn>light DOM</dfn>. -->

So, in the example above, the shadow tree is entirely represented by the contents of the `<template>`{html}. The shadow root is automatically created and attached to the `<div>`{html}, which is the shadow host.

Instead, we can programmatically attach a shadow using the `.attachShadow()`{js} method. Keep in mind that not all elements may have a shadow attached; in general, shadows are attached to custom elements. We are only using `<div>`{html} elements as an example. To attach a shadow in JavaScript, first, we obtain a reference to the `div`{tag}; then, we call the method with an options object as first argument.

```js
const div = document.querySelector('#shadow-host');
div.attachShadow({ mode: 'closed' });
```

Here, we see the equivalent of the `shadowrootmode`{attr} attribute we used on the `<template>`{html} earlier, when using declarative shadow DOM. The `mode`{js} essentially determines whether or not the shadow host exposes a reference to the shadow root in its `.shadowRoot`{js} property. When the `mode`{js} is `'open'`{js}, then one may retrieve a reference to the shadow root by accessing `div.shadowRoot`{js}; when the `mode`{js} is `'closed'`{js}, then the `.shadowRoot`{js} property evaluates to `null`{js} instead.

:::info
Using open shadow roots on custom elements is generally not needed; closed shadows are recommended for complete encapsulation. Specifically, JavaScript should not need access to the markup structure in the shadow DOM, since that creates a tight coupling between implementation details of either side. Instead, use methods and properties to interface with a custom element, so that the shadow tree's markup structure is not relied upon.
:::

## Slots

Now, let's say we want to create a custom element that renders a button which toggles a dropdown. Naturally, we want to be able to insert arbitrary content into both the dropdown and the button. We can do this using native `<slot>`{html} elements. In short, (direct) children are slotted into a `<slot>`{html} element. We are allowed multiple slots, and we may name them with a `name`{attr} attribute. Then, we can slot the children of the shadow host into certain named slots by giving the children a matching `slot`{attr} attribute. Elements without a `slot`{attr} attribute are slotted in the `<slot>`{html} element that has no `name`{attr} attribute (in a way, this is the "default" slot).

Let's look at an example implementation for the dropdown component. For simplicity, let's use the declarative way of attaching a shadow.

```html
<custom-dropdown>
	<template shadowrootmode="closed">
		<button>
			<slot name="label"></slot>
		</button>
		<div id="dropdown">
			<slot></slot>
		</div>
	</template>

	<span slot="label">Click me!</span>
	<p>I am inside the dropdown</p>
	<div>I am also inside the dropdown</div>
</custom-dropdown>
```

The `span`{tag} with `slot="label"`{attr} is slotted into the `<slot>`{html} with `name="label"`{attr} (since those names match). The `p`{tag} and `div`{tag} do not have a `slot`{attr} attribute and are thus slotted into the unnamed `<slot>`{html}.

It might be a bit unclear where the slotted children live. Are the inside the shadow DOM, which they are slotted into, or are they children of the shadow host? It is the latter; the slots signify where to render the children of the shadow host, but they are not part of the shadow tree. This is an important distinction both for styling and scripting.

## Encapsulation

The primary focus of shadow DOM is encapsulation. So, let's go through how exactly shadow DOM is protected from outside JavaScript and CSS.

### Script encapsulation

First, let's have a look at how shadow DOM is protected from outside JavaScript.

Since shadow DOM is not part of the same DOM tree as its host, we cannot find elements inside a shadow DOM using `document.querySelector()`{js}. Instead, if we need to find a reference to an element in the shadow tree, we need to call `.querySelector()`{js} on the shadow root instead. This is where `'open'`{js} and `'closed'`{js} shadows come in; if the shadow is `'open'`{js}, then document-level JavaScript can obtain a reference to the shadow root through the `.shadowRoot`{js} property, and can subsequently query the shadow tree. With `'closed'`{js} shadows, this is not possible; document-level JavaScript can no longer obtain a reference to the shadow root or an element inside the shadow tree if not explicitly given by the host element.

The encapsulation really just comes from scoping. In the case of closed shadows, the references to the shadow root are not exposed to code that is not creating it. One reference is returned by the `.attachShadow()`{js} call; it is then wise to keep a reference to it around, usually in the form of a private property when writing vanilla web components.

The beauty of this encapsulation is that web component authors are free to change internal implementation details as long as the interface remains the same. If the methods and properties don't behave differently, then code relying on those will by definition still work. This promotes more stable, reusable code.

### Style encapsulation

Applying styles to a shadow is as simple as including a `<style>`{html} element inside the shadow tree. And, while shadow DOM provides some form of encapsulation, it is a bit more nuanced than saying "styles don't bleed into shadows". There is a very important distinction to make.

:::info
**Note:** Adding a `<style>`{html} element to the shadow tree is the most straight-forward way of styling it, but not necessarily the cleanest. If the element itself is not desired, an alternative is creating a `CSSStyleSheet`{js} object and using its `.replace()`{js} method to set its contents. Then, it can be added to the shadow by adding it to the `.adoptedStyleSheets`{js} array on the shadow root itself.
:::

First: selectors outside a shadow DOM do not select (and therefore do not affect) markup inside the shadow, since they are separate DOM trees. Similarly, styles inside a shadow DOM cannot select elements outside of the shadow.

Inherited styles _do_ bleed into the shadow tree; while this may sound undesired at first, it is generally not. For example, text-related properties such as `font-family`{css} or `letter-spacing`{css} are inherited properties, and are therefore applied to elements inside shadow trees as well (so we don't have to repeat those declarations in every shadow). Similarly, CSS custom properties are also inherited by default, which allows us to create styling APIs for our components.

There are additional, more specific methods for styling something on the other side of the shadow boundary. Specifically, when used inside a shadow DOM:

- `:host`{sel} selects the host element;
- `:host(selector)`{sel} selects the host element if it also matches `selector`{sel}. For example `:host([hidden])`{sel} selects the host if it has the `hidden`{attr} attribute.
- `::slotted(selector)`{sel} selects an element slotted into a certain `<slot>`{html} element, specifically only direct children that match `selector`{sel}. To target a named slot, apply the pseudo-element directly to the slot, like `slot[name=foo]::slotted(…)`{sel}. Note that it is not possible to select "deep" elements this way; only direct, slotted children can be selected.

This gives us control from the inside of the shadow, but what about the other way around? After all, if we're authoring a web component, we also want to provide _some_ amount of flexibility to those using our components. For that, we use parts.

In short, <dfn>parts</dfn> are like classes; they are names for specific elements inside a certain shadow, and they are exposed by that very name to the outer DOM.

To name a part, use the `part`{attr} attribute on the element(s) to expose to CSS outside the shadow. This attribute is, like `class`{attr}, a space-separated list of tokens. We may then select the element in question by any of the names in the list through `::part(name)`{sel}. In a way, this behavior is similar to some built-in pseudo-elements that allow styling of certain native elements, such as using `::-webkit-slider-thumb`{sel} to style the knob on a `<input type="range">`{html}. It is also possible to select a part using multiple different part names by space-separating them inside the `::part(…)`{sel} selector like `::part(name1 name2)`{sel}.

## Shadows in Yozo

In Yozo, the boilerplate logic behind attaching and and managing a shadow is abstracted away. It stays close to the native API to make the transition from vanilla components easier, but takes away the repetitive nature of writing web components with shadows. Let's look at an example:

```yz
<title>in-shadow</title>
<template mode="closed">
	<div>I am in the shadow, and I am red!</div>
</template>
<script>
const div = query('div');
// …
</script>
<style>
div { color: red; }
</style>
```

When the [`<template>`](/docs/components/template/) element has a `mode`{attr} attribute, a shadow is created with the given mode. Additional options to the underlying `.attachShadow(…)`{js} call may be added as additional attributes, such as setting `delegates-focus="true"`{attr} to pass the `delegatesFocus: true`{js} option to `.attachShadow(…)`{sel}.

Then, querying the template becomes a bit less verbose with [`query()`](/docs/components/query/). Additionally, this helper function works very similarly for elements without a shadow, making it easier to redesign a component if necessary.

The [`<style>`](/docs/components/style/) block is automatically applied to the shadow, but not appended as `<style>`{yz} element. This keeps the shadow tree clean.

This gives authors complete control over how they want to set up their web components. Boilerplate is hidden, but still completely in the author's control. And, even if one would want to manually attach the shadow, that is possible, too:

```yz
<title>in-shadow</title>
<script>
const shadow = this.attachShadow({ mode: 'closed' });
shadow.innerHTML = `…`;
const div = shadow.querySelector('div');
// …
</script>
```

## See also

- [Using shadow DOM on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM)
- [Web Components on MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_components)

