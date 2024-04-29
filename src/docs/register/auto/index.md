---
{
	"layout": "layouts/docs.liquid",
	"title": "register.auto()",
	"description": "Register components dynamically using `register.auto()`{js}, depending on whether or not it is found in the document or in other component templates."
}
---

## Syntax

```js
register.auto(find);
```

### Parameters

`find`{arg}
: A function that finds and returns a URL based on the name of a component. It receives one argument; a `name`{arg}, as a string. This is the `.localName`{js} of an undefined custom element that was found either on the page or inside another component's template. Then, a URL should be returned (either as a string or as `URL`{js} object) to pass to [`register()`](/docs/register/). Alternatively, something falsey may be returned to avoid registration for the given `name`{arg}. The callback fires only once per `name`{arg}.

### Return value

None (`undefined`{js}).

:::warning
**Warning:** `register.auto()`{js} can only be called once; subsequent calls do nothing. Furthermore, the automatic registration cannot be stopped (although an early return can be implemented into the `find`{arg} function).
:::

## Details

This function is a much more developer-friendly alternative to component registration. Instead of having to keep track of each component on a page-by-pase basis and registering them using `register()`{js}, this allows a single snippet to be used across all pages, and without registering unused components. The main downside of `register.auto()`{js} comes into play when using Yozo in the context of very component-heavy pages; instead of registering all components as soon as the page loads, components used inside other component's templates can only be loaded after the latter has been fetched and parsed. In mostly-static pages, this is usually fine (especially if the parent components behave nicely while not yet defined), but in case there are many (nested) custom elements present and potentially visible on page load, manually listing them and registering using `register()`{js} may be preferred.

It should be noted that `register.auto()`{js} looks for elements in the page exactly once on `DOMContentLoaded`{str} (or immediately when called, if the DOM is already loaded). For component templates, it scans each template once upon component registration (not element creation) meaning any elements registered _before_ calling `register.auto()`{js} are not scanned. Component templates are scanned in their entirety, disregarding any in-template [`#if`](/docs/components/template/if-else/) statements or other inline flow control.

## Examples

### This site

To get the most out of `register.auto()`{js}, it is good to structure component files in a way that makes them easy to look up by their name. Usually, that means giving the definition files the same name as the components themselves. In the case of Yozo's website, they are further segmented based on their prefix. Lower level UI components are prefixed `ui-`{tag}, and larger site-wide components (such as the navigation menu or footer) are prefixed with `site-`{tag}. They are then placed in folders by this very prefix. So, for example, the `ui-button`{tag} component is defined in `/components/ui/ui-button.yz`{url} (in reality, the `/components/`{url} part of the URL is slightly different, but static nonetheless). The navigation menu, named `site-nav`{tag}, is defined in `/components/site/site-nav.yz`{url}. This pattern makes them very easy to look up, and so each page registers its components using

```js
window.yozo.register.auto(name => {
	const folder = name.split('-', 1)[0];
	return `/components/${folder}/${name}.yz`;
});
```

Using `register.auto()`{js} allows for seamless component creation and usage, because once a component file has been created, it is usable immediately. Furthermore, it allows for a simple static site setup that doesn't need to concern itself with what components are used on each page.

## Usage notes

Like `register()`{js}, it is advised to use the full `window.yozo.`{js}-prefixed expression with `register.auto()`{js} as opposed to destructuring `register`{js}, as demonstrated in the example. This is because `register`{js} itself is somewhat ambiguously named without context. It is also not available by default in component [`<script>`](/docs/components/script/) sections for this very reason.

## See also

- [`register()`](/docs/register/)
- [components](/docs/components/)
- [`<title>`](/docs/components/title/)
