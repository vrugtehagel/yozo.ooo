---
{
	"title": "Why Yozo?",
	"date": "2024-12-14",
	"description": "Why does Yozo exist, and what problems does it solve? Is it better than writing vanilla components, or using a framework? And - how is it different?",
	"terms": "why",
	"footnote": "Keep it simple."
}
---

## Simplicity

I am a strong believer that programmers should try to make things as simple as possible. Often, and perhaps counter-intuitively, that means not grasping for the nearest package to solve our problems, but implementing a simple solution ourselves. For the longest time, I stuck to that idea, and wrote vanilla custom elements, because they are simplistic both in setup as well as usage. In fact, they require no setup at all; we can write our component definitions in JS files, and load them on our pages with `<script>`{html} elements. With just that, the custom elements are fully functional.

However, custom elements are not simplistic to write. The web component APIs are low-level and require quite some boilerplate. Overall, I felt writing vanilla components wasn't a good experience, and I realized there was also a cost associated with this boilerplate code.

Components are a problem that has been solved over and over. Different developers have different tastes, and there are many flavors of libraries and frameworks out there catering to different types of programmers. But while many of them provide a better authoring experience, they compromise on simplicity in other areas, like setting up projects. To get a site up and running with a framework or library, we need a package manager, install packages, configure them, understand how to use them, and only then do we get to the good parts. They are not "drop-in" like vanilla custom elements.

That's why I started to build Yozo. I wanted to keep the drop-in nature of vanilla custom elements while also providing authors with solid, intuitive and concise syntax to write their components. Naturally, this is opinion-based, but I think Yozo's APIs are quite nice to read and write. And if I may be completely honest; I also created Yozo for fun. I'm having a blast putting this all together and seeing it come to life. But I also am aware of the dangers of bias and intentionally strive to make Yozo something that other people will want to use, too; not just me.

## Performance

There are two important branches of performance relevant to front-end libraries and frameworks. The first is runtime performance; the second is load performance, i.e. how long it takes to download and initialize.

The former, runtime performance, is something most frameworks value a lot. They pride themselves on being one of the fastest. But in reality, this speed is only relevant when building big, full-fledged and logic-heavy web applications, not so much when building mostly-static sites. Browsers have spent decades and billions of dollars improving their engines to run JavaScript faster, and they've done a pretty darn good job. Of course, it doesn't mean we should be writing less efficient code, but it does mean we can safely leave a bit of runtime performance on the table to instead focus on load-time performance and ease-of-use.

Yozo focuses primarily on those two. It does not focus so much on runtime performance, and I'm well aware it is somewhat lacking in that regard compared to other frameworks. Unfortunately it's a trade-off that can only be mitigated to a certain extent, at least within the constraints Yozo adheres to; being drop-in means it needs client-side component compilation, and being tiny means less room for optimizations. But that compromise ultimately turns into some big wins; it is _tiny_, currently a healthy margin below its hard self-imposed 5kB limit, and the component syntax allows for slim implementations of custom elements. All this allows it to load very fast; less code to download means the downloading is done sooner.

And as any SEO experts know; the faster a page loads, the higher the retention. People are not keen on sitting around to wait for pages to load. As it turns out, the method utilized by Yozo is incredibly beneficial for load times. It is so efficient that even the component-heavy pages, that are essentially small web apps (like Yozo's [playground](/play/)) can score 90+ in lighthouse.

### Let's see the numbers

Unfortunately, framework load-time performance is a bit hard to measure in a fair way, because it depends very much on what is being authored. The simplest metric is bundle size, but even this is not so straight-forward as it may seem. Many frameworks do tree-shaking, which means they throw out the bits you're not using at compilation. This makes it quite hard to measure what the up-front cost of the frameworks is, because it changes depending on the needs of the components. What we _can_ do, is compare the size for an example component in different frameworks. The prime example is the `<click-counter>`{html} component, also featured on the [homepage](/). So, we'll compare this component written in Yozo and in its two closest web-component-based competitors; [Lit](https://lit.dev/) and [Stencil](https://stenciljs.com/).

To provide a fair comparison, here's what we do. First, we'll measure the total amount of data sent over the wire when loading the component; in other words, this is the sum of the gzipped sizes of all the output files. In the case of Yozo, this is the gzipped size of Yozo, plus the gzipped size of the component definition, plus the gzipped size of the "glue code", i.e. the `window.yozo.register()`{js} call. Next, we measure a rough estimate of the overhead of the frameworks. That is to say; how much code are we loading that is _not_ the component itself. This is easy to measure for Yozo, but less so for Stencil and Lit. So, instead of analyzing exactly what part of the code counts as "component" and what doesn't, we can measure the (gzipped) size of the source code for the component. The source code describes how our component must behave, which is retained one way or another in the build output. Potentially, this part is smaller in the output due to minification, but it could also be larger due to transpilation of modern JavaScript features. Either way, while the size of the source code does not entirely accurately reflect the amount of component code in the output, it does give us a rough estimate for what part of the build output is component implementation and what part is overhead. Now, the results; it includes numbers for the total transferred size and the estimate for the framework overhead.

<svg viewBox="0 0 320 375" style="display: block; max-width: 320px; margin: 2rem auto;">
	<text x="0" y="18" fill="var(--text-color)">Yozo</text>
	<rect x="0" y="27" width="65.74%" height="54" fill="var(--meta-color)"/>
	<rect x="0" y="54" width="65.74%" height="27" fill="var(--keyword-color)"/>
	<rect x="0" y="54" width="61.71%" height="27" fill="var(--name-color)"/>
	<text x="6" y="46.5" fill="var(--sub-background-color)" font-size="15" font-weight="800">5090</text>
	<text x="6" y="73.5" fill="var(--sub-background-color)" font-size="15" font-weight="800">4778</text>
	<text x="0" y="116" fill="var(--text-color)">Stencil</text>
	<rect x="0" y="125" width="88.48%" height="54" fill="var(--meta-color)"/>
	<rect x="0" y="152" width="88.48%" height="27" fill="var(--keyword-color)"/>
	<rect x="0" y="152" width="83.41%" height="27" fill="var(--name-color)"/>
	<text x="6" y="144.5" fill="var(--sub-background-color)" font-size="15" font-weight="800">6851</text>
	<text x="6" y="171.5" fill="var(--sub-background-color)" font-size="15" font-weight="800">6459</text>
	<text x="0" y="214" fill="var(--text-color)">Lit</text>
	<rect x="0" y="223" width="100%" height="54" fill="var(--meta-color)"/>
	<rect x="0" y="250" width="100%" height="27" fill="var(--keyword-color)"/>
	<rect x="0" y="250" width="94.65%" height="27" fill="var(--name-color)"/>
	<text x="6" y="242.5" fill="var(--sub-background-color)" font-size="15" font-weight="800">7743</text>
	<text x="6" y="269.5" fill="var(--sub-background-color)" font-size="15" font-weight="800">7329</text>
	<text x="0" y="312" fill="var(--text-color)">Vanilla</text>
	<rect x="0" y="321" width="8.63%" height="54" fill="var(--meta-color)"/>
	<rect x="0" y="348" width="8.63%" height="27" fill="var(--keyword-color)"/>
	<rect x="0" y="348" width="0%" height="27" fill="var(--name-color)"/>
	<text x="8.63%" y="340.5" fill="var(--meta-color)" transform="translate(6, 0)" font-size="15" font-weight="800">668</text>
	<text x="8.63%" y="367.5" fill="var(--name-color)" transform="translate(6, 0)" font-size="15" font-weight="800">0</text>
</svg>

It is clear that, if load performance needs to be optimized for, then writing vanilla web components is still by far the best. At least, for loading a single component, it is. When loading many components, especially interactive ones, there is a natural breaking point at which the per-component cost savings of using a framework starts to outweigh the up-front cost of the framework. However, this threshold is heavily dependent on the amount of logic each component needs; if your components consist almost entirely of HTML and CSS, then this theshold is effectively never reached, because the size of the component is then more-or-less the size of the HTML and CSS, and frameworks don't generally help to reduce this size compared to how a vanilla component would do this. For highly interactive components, however, frameworks catch up quickly because they provide features like reactivity that greatly reduce the amount of code that needs to be written compared to vanilla.

From the example `click-counter`{tag} component, it is clear that there is a price for the boilerplate code we need in vanilla components. Yes, vanilla components have 0 overhead; but Lit and Stencil's component definitions come in at about 40% smaller, and Yozo's ends up even smaller at less than half the size of the vanilla component definition. With our rough estimates of the overhead in each framework, and assuming components with a similar level of interactivity as the example `click-counter`{tag} component, the amount of components needed to beat out vanilla components size-wise is 15 for Yozo, 25 for Stencil, and 31 for Lit. These are conservative (and relatively inaccurate) estimates, though; most of the time, components include more JavaScript than the `click-counter`{tag}. Most likely, these guesses are higher than they would turn out to be in practice.

## Close to native

Whenever I try out a framework, there are two categories of things I need to learn. The first category is to find out what the syntax is, what the tools are called, etcetera. This part is fine; I have to translate what I know into the specific vocabulary of the framework in question. The second thing I need to learn is the specifics of how the framework works exactly. How does it _want_ me to do things. This is usually the frustrating part. I prefer keeping things as close to vanilla as possible, but not all frameworks agree with that. In particular, this was something I struggled with in the past when being introduced to virtual DOMs. I was confused that I was creating HTML elements, but that they didn't quite exist until a certain point in the component lifecycle, and obtaining a reference to them felt strange.

So for Yozo, I wanted to keep things as close to vanilla as possible. If you know and understand vanilla web components, it shouldn't be a leap to get used to Yozo. Of course, the syntax is different. But the concepts are, most of the time, a one-to-one mapping. For example, let's say we want to use a more niche feature of shadow roots; manual slot assignment. Natively, this is supported through the `slotAssignment: 'manual'`{js} option passed to the `.attachShadow()`{js} call. Since those options are obtained from the attributes on the component's `<template>`{html} element, we can intuitively expect that this is achievable in Yozo with a `slot-assignment="manual"`{attr} attribute. This way of dynamically mapping to native APIs has three main benefits:

- We don't need to learn a new vocabulary; just where and/or how names are mapped from Yozo to vanilla.
- Yozo is (somewhat) future-proof. When new features land in browsers for web components, there's a good chance Yozo already supports them.
- As a bonus, Yozo gets to be smaller! Because these things are dynamically tied together, the source code does not cater for vanilla features explicitly. For example, the string "slotAssignment" does not occur in Yozo's source; it just works.

In other words, Yozo tries to upgrade existing native functionality with wrappers that are mapped to vanilla, but are easier in use. This includes component definitions that map to the custom element syntax that you already know, but also more general purpose things like `when()`{js} or `interval()`{js}. The genericism also means that most of what Yozo provides is perfectly usable outside of component definitions, making it easier to tie together entire systems. For example, user-specific settings on this site (like tab size) are stored as live variables in a global store, and tied to `localStorage`{js}. Components can then treat it like they would with local live variables, and they automatically react to changes just the same.

## Shared interests

I am just a regular person. I like to write code. My goal with Yozo is not and never will be to make money; it is to write something I want to use. Something _you_ would want to use. A piece of art, if you will. The current big players in the web component space are run by huge companies, like Stencil being maintained by VC-backed Ionic and Lit by one of the largest companies on the planet; Google. These companies have a clear, simple goal: to make money. That's sustainability for companies, and it's normal! Don't get me wrong; I don't mean to say they're not trying to create something beautiful, themselves. But it _does_ mean they are more likely to compromise on the framework or its users in favor of the company's health. Even if the developers working on the framework don't want that. On the other hand, I can promise that I will _never_ ask money for Yozo, I will _never_ litter the site with advertisements or collect your personal data, and I will _never_ sell Yozo. I wouldn't be able to sleep if I did.

## That's why.

As may be clear by now, I believe in Yozo and its strengths. It is small, and livens up pages wherever it goes. It may not be the most performant runtime-wise, but it sure loads fast. It provides helpful functionality even outside components, and it's made with love. I strongly believe it has a place in the ecosystem, even if it is a small one.
