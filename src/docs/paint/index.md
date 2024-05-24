---
{
	"layout": "layouts/docs.liquid",
	"title": "paint()",
	"description": "The `paint()`{js} function creates a `Flow`{js} that fires once, after the browser has painted."
}
---

## Syntax

```js
paint();
```

### Parameters

None.

### Return value

A [`Flow`](/docs/flow/) object that triggers once after the browser has painted. This is equivalent to a double `requestAnimationFrame()`{js} (whose callback is executed _before_ the browser paints). The trigger receives a single argument, a `DOMHighResTimeStamp`{js} representing the time of the frame's rendering, similar to the trigger argument that [`frame()`](/docs/frame/) or the native `requestAnimationFrame()`{js} receives.

## Details

The `paint()`{js} function is an alternative to `setTimeout()`{js} hacks. To use `paint()`{js} properly, it is good to understand how browsers handle DOM changes and when they do rendering work like computing styles, layout and paint and compositioning. Specifically, when doing multiple changes to the DOM and its styles, browsers usually do not take into account what exactly changed, they simply see the cumulative result when they need to render. For example, let's say there is an element with a red background and a `transition`{css} with a duration of `1s`{css} so that the background color smoothly changes. If we want to change this to blue without the transition, then perhaps intuitively, we can do

```js
element.style.transitionDuration = '0s';
element.style.backgroundColor = 'blue';
element.style.transitionDuration = '1s';
```

Unfortunately, this doesn't work; the browser doesn't actually use any of these values until it renders, at which point the `transition-duration`{css} is "back to" (still) `1s`{css} and the `background-color`{css} has changed to `blue`{css}. The result is that the transition runs as if we never set `.transitionDuration`{js} to `'0s'`{js}.

Often, these types of issues are circumvented with `setTimeout()`{js} hacks, or by forcing the browser to calculate styles before it actually needs to render. Instead, with `paint()`{js}, we can wait until the browser renders on its own volition, improving performance and code readability. In the above example, we'll just wait until the browser has painted before setting the `transition-duration`{css} back to `1s`{css}:

```js
element.style.transitionDuration = '0s';
element.style.backgroundColor = 'blue';
await paint();
element.style.transitionDuration = '1s';
```

## Examples

### Fade new element in

In this example we'll be transitioning an element into view after just adding it to the DOM. Let's say we've defined some styles for a certain `#fade-in`{sel} element:

```css
#fade-in {
	opacity: 1;
	transition: opacity .2s 0s;
	&[hidden] {
		opacity: 0;
	}
}
```

Now, we want to create this `#fade-in`{sel} element, add the `hidden`{attr} attribute, append it to the DOM, and then remove the `hidden`{attr} attribute to run the transition. This doesn't work just like that, however, because the browser won't take the styles for the `[hidden]`{sel} state into account since it never actually has to render that. The solution is to wait for the browser to paint before removing the `hidden`{attr} attribute:

```js
const element = createFadeInElement();
element.id = 'fade-in';
element.hidden = true;
document.body.append(element);

await paint();

element.hidden = false;
```

Now, our styles for the `[hidden]`{sel} state are applied and rendered first; the element is still hidden (since it has `opacity: 0`{css}), and only then do we remove the `hidden`{attr} attribute, allowing the browser to see what we want to transition from and to.

## See also

- [`frame()`](/docs/frame/)
- [How browsers render](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work#render)
