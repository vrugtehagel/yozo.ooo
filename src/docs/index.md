---
{
	"layout": "layouts/docs.liquid",
	"title": "Documentation",
	"description": "Here, everything Yozo provides is explained in detail, from simple type signatures to deep examples about its inner workings."
}
---

## Getting started

Yozo is a web component-based framework that tries to maximize what you get while remaining as small as possible. It also tries to be easy-to-use in every environment, by removing the need for a build step completely. To give Yozo a try, [dowload](/download/) the latest development version of Yozo and load it on a page like so:

```html
<script src="./yozo-dev.js"></script>
```

If placed in a different directory than the page this script tag is included on, edit the path to match wherever Yozo is. Most of the time, it is simplest to add Yozo to the root directory of the site and linking to it using `url`/yozo-dev.js`` and `url`/yozo-lib.js``.

:::info
**Note:** To follow along without setting up a new project locally, use Yozo's [playground](/play/)!
:::

To verify that Yozo loads correctly, simply check that the `js`yozo`` global (i.e. `js`window.yozo``) is available.

With that out of the way, we're ready to create our first component. First, let's come up with a name for our component. As Yozo is based on native web components, we'll need a name with a hyphen in it; let's go for "my-component". Now, let's create a new file `url`my-component.yz``, with the following contents:

```yz
<title>my-component</title>
<template>
	Hello world!
</template>
```

The [`<title>`](/docs/components/title/) element here defines the name of our component, so that we'll be able to use it as `html`<my-component>`` (the filename does not have to match this). We also render some content through the [`<template>`](/docs/components/template/) element, so that we can see our custom element come to life.

Next, since our page does not yet know that this file exists, we'll need to tell Yozo to process this file. To do that, we'll need:

```js
window.yozo.register('./my-component.yz');
```

Again, if the file was placed in a different directory than the page itself, edit the URL to match its location. Yozo also offers a way of automatically discovering and processing components using [`register.auto()`](/docs/register/auto/), but for now, let's register `tag`my-component`` explicitly.

Now that Yozo knows about our component, it is ready to be used; and because it is a custom element, we can use it like any regular HTML element:

```html
<my-component></my-component>
```

If everything has been done correctly, the text "Hello world" should show on the page. Congrats! Yozo has been set up successfully, and you've brought your first component to life. To learn more about how components are built, check out the [components](/docs/components/) page.

Note that most of Yozo's functionality is useful both inside as well as outside component files. For example, [`when()`](/docs/when/) is a very ergonomic and readable way to do event listeners, changing `js`.addEventListener()`` into something that reads like text:

```js
const { when } = window.yozo;

when(button).clicks().then(() => { /* … */ });
when(input).keydowns().throttle(1000).then(() => {
	/* … */
});

await when(img).loads().once()
	.after(() => img.src = '/cat.png');
```

And it doesn't end there; see below for a complete list of the things Yozo provides.

## Reference

Below is a comprehensive list of Yozo's goodies. Note that some of the functionality has other, related functionality that is not explicitly listed. To learn more about the topics, navigate to their respective pages.

- [`register()`](/docs/register/) and [`register.auto()`](/docs/register/auto/) for component registration;
- Feature-rich component definitions, from [reactive attributes](/docs/components/meta/attribute/) to [scoped styles](/docs/components/style/) (see details on the [components](/docs/components/) page);
- Simple, fine-grained state management with [`live()`](/docs/live/);
- Simpler listeners and callbacks with [flows](/docs/flow/), specifically:
	- Event listeners through [`when()`](/docs/when/);
	- Observers of any type through [`when().observes()`](/docs/when/observes/);
	- Timeouts with [`timeout()`](/docs/timeout/);
	- Intervals with [`interval()`](/docs/interval/);
	- Running callbacks every frame with [`frame()`](/docs/frame/);
	- Waiting for the browser to paint with [`paint()`](/docs/paint/);
	- For advanced cases, manually creating flows with the [`Flow`](/docs/flow/constructor) constructor;
- State-dependent effects through [`effect()`](/docs/effect/);
- Purifying functions with side effects through [`purify()`](/docs/purify/);
- Creating your own monitoring mechanisms with [`monitor()`](/docs/monitor/).

## Tests

Yozo values a robust and trustworthy environment. Since a big part of Yozo's functionality (i.e. the custom element part) expects a browser environment, a simple custom testing framework was put in place so that tests can be written in a format easily digestable by both [Deno](https://deno.land/) (for the non-browser specific tests) as well as the browser.

Every page in the documentation has associated tests. To avoid unnecessarily running tests in user's browsers, they are extracted into a separate page. To view the tests for a specific page, simply replace the `url`/docs/`` part of the URL with `url`/test/``. For example, to see the tests for `js`live()``, whose URL is [yozo.ooo/docs/live/](/docs/live/), navigate to [yozo.ooo/test/live/](/docs/live/test/). The root directory for the tests, [yozo.ooo/test/](/test/), collects all the tests into one page, making it easy to see if any of Yozo's tests are failing.
