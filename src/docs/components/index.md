---
{
	"layout": "layouts/docs.liquid",
	"title": "Components",
	"description": "Write reusable web components, in a structured, straight-foward format, with features ranging from inline template logic to fine-grained reactivity."
}
---

## Anatomy

Yozo's main attraction is components. Essentially, Yozo provides a much more streamlined way to write native web components. It features shadow roots, templates, scoped styles, hooks, simple ways to add attributes, methods, or properties, and more!

So, let's dive into the anatomy of a Yozo component. First of all, each component should be written in its own file. Generally, it is recommended to use a `url`.yz`` extension, so it is easy for developers to recognize the files. Then, configure your editor to highlight `url`.yz`` files as HTML. However, the function responsible for parsing the files, [`register()`](/docs/register/), is not picky about the extension; it will try to read any file it receives regardless of extension. Since the format is HTML-like, if configuring syntax highlighting for `url`.yz`` files is a problem, the next-best option would be to use `url`.html``.

### Metadata

The first thing in a component file is the [`<title>`](/docs/components/title/). This tag describes the name of the component. In general, it's recommended to align the file name with the component name (for better synergy with [`register.auto()`](/docs/register/auto/) as well as maintainability), but this is an entirely optional convention. After having defined the name, [`<meta>`](/docs/components/meta/) tags follow, defining the exposed API for the component in question. This includes [attributes](/docs/components/meta/attribute/), [properties](/docs/components/meta/property/), [methods](/docs/components/meta/method/) and whether or not the component is [form-associated](/docs/components/meta/form-associated/). The meta tags are not only self-documentating, Yozo also uses them to construct and expose said API on the custom element. For example, we might define:

```yz
<title>space-ship</title>
<meta attribute="speed" type="number">
<meta attribute="haspilot" as="hasPilot" type="boolean">
<meta method="accelerate">
```

In this example, our custom element is called `html`<space-ship>``, has two attributes `attr`speed`` and `attr`haspilot``, with associated `js`.speed`` and `js`.hasPilot`` properties respectively, and finally an `js`.accelerate()`` method. The latter must be defined in the [`<script>`](/docs/script/) section. For more information on configuration options, see [`<meta>`](/docs/components/meta/).

### The template

Next up is the [template](/docs/components/template/). Yozo allows both shadow roots as well as shadow-less components. For encapsulation, shadow roots are recommended. In some cases, like when working with a class-based CSS library or framework, shadow-less components would be preferred. An example of a template could be:

```yz
<template mode="closed">
	Click the button:
	<button @click="$.onclick()">
		{{ $.label }}
	</button>
</template>
```

The shadow root's configuration is passed through the `yz`<template>``'s attributes, and the template's body is put into the shadow root. When using shadow-less components, leave out the `yz`<template>``'s attributes, and the template's content will be inserted once the component connects to the DOM. Inside the template, there are a variety of helpful shorthands to add some life to the components, ranging from basic things like an [`{{ inline }}`](/docs/components/template/inline/) expression, to [conditions](/docs/components/template/if-else/), to [event listeners](/docs/components/template/events/) and of course [reactive attributes](/docs/components/template/attributes/) and [properties](/docs/components/template/properties/). For more detailed explanations on the template syntax, see [`<template>`](/docs/components/template/).

### Logic

Component logic is written inside a [`<script>`](/docs/components/script/) tag. Inside this `yz`<script>`` tag, there are a few "magically" imported variables. First and foremost, most of Yozo's helpers (such as [`when()`](/docs/when/), [`effect()`](/docs/effect/), and more). The [`connected()`](/docs/components/connected/) and [`disconnected()`](/docs/components/disconnected/) hooks are also directly available, and represet the native `connectedCallback()` and `disconnectedCallback()` that custom elements have. There is also a function [`query()`](/docs/components/query/) for a straight-foward way to access the elements in your template. Last, but not least, there is [`$`](/docs/components/$/); the state object tied to the component instance. Some of the properties on the `js`$`` object are exposed by the custom element itself, but only if described so in the metadata. For example, defining a function `js`$.doThing()`` itself will allow it to be used inside the template, but not expose it to the "outside" (i.e. `js`myComponent.doThing`` remains `js`undefined``). However, adding `yz`<meta method="doThing">`` subsequently exposes it, and `js`myComponent.doThing`` suddenly is defined. For an in-depth look at what's possible in `yz`<script>`` sections, see [`<script>`](/docs/components/script/).

### Styles

Writing component styles in Yozo components is much like writing styles in a regular HTML document. The [`<style>`](/docs/components/style/) tag is used to write CSS into. Whether or not the styles are scoped depends on whether a shadow root has been specified (on the component's `yz`<template>`` element). If that's the case, then web component related CSS selectors such as `sel`:host`` can be used; if there is no shadow root, then the styles written there are "global", i.e. apply to any context the element is used in. For a complete description on component styles, see [`<style>`](/docs/components/style/).

## Examples

To demonstrate the power of Yozo components, we'll have a look at some variations of a basic `tag`click-counter`` component; a component that renders a single button, and counts the amount of times it's being clicked.

### Reccommended

First, we'll go through the recommended way of approaching this component:

```yz
<title>click-counter</title>
<meta attribute="amount" type="number">
<meta method="reset">

<template mode="closed">
	<button @click="$.amount++">
		{{ $.amount }} clicks
	</button>
</template>
<script>
$.reset = () => $.amount = 0;
</script>
<style>
:host {
	display: block;
}
button {
	padding: .75rem 1.5rem;
	cursor: pointer;
}
</style>
```

Just by looking at the metadata in the first three lines of the component, we know how to use it; it's called `html`<click-counter>``, it has one attribute (the `attr`amount`` attribute) which represents a number, as well as a `js`.reset()`` method.

Diving into the actual component structure, we see it has a closed shadow root (from `attr`mode="closed"``), with a single element in its template, a `yz`<button>``. Upon clicking the button (`attr`@click``), the `js`.amount`` property is incremented. This property is a number, as specified, and reactively tied to the attribute, meaning the attribute says in sync with the property at all times. Inside the button, we render the amount of clicks as text. Next up, at the script section, we define the `js`.reset()`` method, which is exposed to the outside through being defined in a `yz`<meta>`` tag. Lastly, there's some (scoped) styling. The `sel`:host`` selector is a web components feature; inside a shadow root, it refers to the shadow host; in this case, the `html`<click-counter>`` element itself.

### Manual updates

As an additional excercise, let's write the same component with a static template. Then, we'll add the interactivity manually in the `yz`<script>``. For brevity, the styles are left out (they would be identical to the previous example).

```yz
<title>click-counter</title>
<meta attribute="amount" type="number">
<meta method="reset">

<template mode="closed">
	<button>0 clicks</button>
</template>
<script>
const button = query('button');

$.reset = () => $.amount = 0;

connected(() => {
	when(button).clicks().then(() => {
		$.amount++;
	});
});

connected(() => {
	effect(() => {
		button.textContent = `${ $.amount } clicks`;
	});
});
</script>
```

The template has been simplified to its bare bones, only containing a simple button and some placeholder text. First, we get a reference to the button through the [`query()`](/docs/components/query/) function.

Then, to replace the `attr`@click`` expression, we set up the first [`connected()`](/docs/components/connected/) hook. Only when the component is connected do we want this click handler set up (and this is what `attr`@click`` does, internally, too). To set up the handler, we use [`when()`](/docs/when/), since it is monitored and therefore is taken down by the `js`connected()`` hook whenever the component disconnects. If we'd have used `js`.addEventListener()``, then repeatedly connecting (and disconnecting) the custom element would set up additional listeners, without ever taking older ones down.

For the `yz`{{ $.amount }}`` expression, we'll set up an [`effect()`](/docs/effect/), since they allow us to describe an update with implicit dependencies. In this case, we simply set the button's `js`.textContent`` to the correct expression. The effect sees that the `js`$.amount`` variable is being accessed, and therefore re-runs the effect whenever `js`$.amount`` changes. Since there's not much of a point to updating the text for disconnected components, we wrap the `js`effect()`` with another `js`connected()`` hook. Since effects, much like the `js`when()`` call, are monitored, the connected callback takes it down whenever the custom element disconnects.

## See also

- [`register()`](/docs/register/)
- [`<title>`](/docs/components/title/)
- [`<meta>`](/docs/components/meta/)
- [`<template>`](/docs/components/template/)
- [`<script>`](/docs/components/script/)
- [`<style>`](/docs/components/style/)
