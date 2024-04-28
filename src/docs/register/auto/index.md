---
{
	"layout": "layouts/docs.liquid",
	"title": "register.auto()",
	"description": "Register components dynamically using `js`register.auto()``, depending on whether or not it is found in the document or in other component templates."
}
---

## Syntax

```js
register.auto(find);
```

### Parameters

`arg`find``
: A function that finds and returns a URL based on the name of a component. It receives one argument; a `arg`name``, as a string. This is the `js`.localName`` of an undefined custom element that was found either on the page or inside another component's template. Then, a URL should be returned (either as a string or as `js`URL`` object) to pass to [`register()`](/docs/register/). Alternatively, something falsey may be returned to avoid registration for the given `arg`name``. The callback fires only once per `arg`name``.

### Return value

None (`js`undefined``).

:::warning
**Warning:** `js`register.auto()`` can only be called once; subsequent calls do nothing. Furthermore, the automatic registration cannot be stopped (although an early return can be implemented into the `arg`find`` function).
:::

## Details

This function is a much more developer-friendly alternative to component registration. Instead of having to keep track of each component on a page-by-pase basis and registering them using `js`register()``, this allows a single snippet to be used across all pages, and without registering unused components. The main downside of `js`register.auto()`` comes into play when using Yozo in the context of very component-heavy pages; instead of registering all components as soon as the page loads, components used inside other component's templates can only be loaded after the latter has been fetched and parsed. In mostly-static pages, this is usually fine (especially if the parent components behave nicely while not yet defined), but in case there are many (nested) custom elements present and potentially visible on page load, manually listing them and registering using `js`register()`` may be preferred.

## Examples

### This site

To get the most out of `js`register.auto()``, it is good to structure component files in a way that makes them easy to look up by their name. Usually, that means giving the definition files the same name as the components themselves. In the case of Yozo's website, they are further segmented based on their prefix. Lower level UI components are prefixed `tag`ui-``, and larger site-wide components (such as the navigation menu or footer) are prefixed with `tag`site-``. They are then placed in folders by this very prefix. So, for example, the `tag`ui-button`` component is defined in `url`/components/ui/ui-button.yz`` (in reality, the `url`/components/`` part of the URL is slightly different, but static nonetheless). The navigation menu, named `tag`site-nav``, is defined in `url`/components/site/site-nav.yz``. This pattern makes them very easy to look up, and so each page registers its components using

```js
window.yozo.register.auto(name => {
	const folder = name.split('-', 1)[0];
	return `/components/${folder}/${name}.yz`;
});
```

Using `js`register.auto()`` allows for seamless component creation and usage, because once a component file has been created, it is usable immediately. Furthermore, it allows for a simple static site setup that doesn't need to concern itself with what components are used on each page.

## Usage notes

Like `js`register()``, it is advised to use the full `js`window.yozo.``-prefixed expression with `js`register.auto()`` as opposed to destructuring `js`register``, as demonstrated in the example. This is because `js`register`` itself is somewhat ambiguously named without context. It is also not available by default in component [`<script>`](/docs/components/script/) sections for this very reason.

## See also

- [`register()`](/docs/register/)
- [components](/docs/components/)
- [`<title>`](/docs/components/title/)
