---
{
	"layout": "layouts/docs.liquid",
	"title": "Documentation",
	"terms": "documentation docs yozo explain tutorial example home start first begin",
	"description": "Here, everything Yozo provides is explained in detail, from simple type signatures to deep examples about its inner workings."
}
---

## Reference

Before we get started, a quick overview. Below is a comprehensive list of Yozo's goodies. Note that some of the functionality has other, related ("nested") functionality that is not explicitly listed here. To learn more about each topic, navigate to their respective pages.

- Feature-rich component definitions syntax, from [reactive attributes](/docs/components/meta/attribute/) to [scoped styles](/docs/components/style/) (see details on the [components](/docs/components/) page);
- [`register()`](/docs/register/) and [`register.auto()`](/docs/register/auto/) for component registration;
- Simple, fine-grained state management with [`live()`](/docs/live/);
- Simpler listeners and callbacks with [flows](/docs/flow/), specifically:
	- Event listeners through [`when()`](/docs/when/), and observers through [`when().observes()`](/docs/when/observes/);
	- Timing-related helpers with [`interval()`](/docs/interval/), [`timeout()`](/docs/timeout/), [`frame()`](/docs/frame/) and [`paint()`](/docs/paint/);
	- For advanced use cases, manually creating flows with the [`Flow`](/docs/flow/constructor) constructor;
- State-dependent effects through [`effect()`](/docs/effect/);
- Purifying functions with side effects through [`purify()`](/docs/purify/);
- Creating your own monitoring mechanisms with [`monitor()`](/docs/monitor/).

## Getting started

Yozo is a web component-based framework that tries to maximize what you get while remaining as small as possible. It also tries to be easy-to-use in every environment, by removing the need for a build step completely. To give Yozo a try, [dowload](/download/) the latest development version of Yozo and load it on a page like so:

```html
<script src="./yozo-dev.js"></script>
```

If placed in a different directory than the page this script tag is included on, edit the path to match wherever Yozo is. Most of the time, it is simplest to add Yozo to the root directory of the site and linking to it using `/yozo-dev.js`{url} and `/yozo-lib.js`{url}.

:::info
**Note:** To follow along without setting up a new project locally, use Yozo's [playground](/play/)!
:::

To verify that Yozo loads correctly, simply check that the `yozo`{js} global (i.e. `window.yozo`{js}) is available.

With that out of the way, we're ready to create our first component. First, let's come up with a name for our component. As Yozo is based on native web components, we'll need a name with a hyphen in it; let's go for "my-component". Now, let's create a new file `my-component.yz`{url}, with the following contents:

```yz
<title>my-component</title>
<template>
	Hello world!
</template>
```

The [`<title>`](/docs/components/title/) element here defines the name of our component, so that we'll be able to use it as `<my-component>`{html} (the filename does not have to match this). We also render some content through the [`<template>`](/docs/components/template/) element, so that we can see our custom element come to life.

Next, since our page does not yet know that this file exists, we'll need to tell Yozo to process this file. To do that, we'll need to call [`register()`](/docs/register/). Yozo also offers a way of automatically discovering and processing components using [`register.auto()`](/docs/register/auto/), but for now, let's register `my-component`{tag} explicitly:

```js
window.yozo.register('./my-component.yz');
```

Now that Yozo knows about our component, it is ready to be used; and because it is a custom element, we can use it like any regular HTML element:

```html
<my-component></my-component>
```

If everything has been done correctly, the text "Hello world" should show on the page. Congrats! Yozo has been set up successfully, and you've brought your first component to life. To learn more about how components are built, check out the [components](/docs/components/) page.

Note that most of Yozo's functionality is useful both inside as well as outside component files. For example, [`when()`](/docs/when/) is a very ergonomic and readable way to do event listeners, changing `.addEventListener()`{js} into something that reads like text:

```js
const { when } = window.yozo;

when(button).clicks().then(() => { /* … */ });
when(input).keydowns().throttle(1000).then(() => {
	/* … */
});

await when(img).loads().once()
	.after(() => img.src = '/cat.png');
```

And it doesn't end there; see the [reference](#reference) above for a complete list of the things Yozo provides.

## Tests

Yozo values a robust and trustworthy environment. Since a big part of Yozo's functionality (i.e. the custom element part) expects a browser environment, a simple custom testing framework was put in place so that tests can be written in a format easily digestable by both [Deno](https://deno.land/) (for the non-browser specific tests) as well as the browser.

Every page in the documentation has associated tests. They are shown at the top right of each page. To avoid unnecessarily running tests in user's browsers, they don't run automatically by default, but it is possible enable that in the site settings (see footer). To run all tests at once, see the [tests page](/test/).
