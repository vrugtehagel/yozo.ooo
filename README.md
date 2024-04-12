# YOZO'S WEBSITE

Website: [yozo.ooo](https://yozo.ooo/) \
Yozo source: [vrugtehagel/yozo](https://github.com/vrugtehagel/yozo)

## Getting started

You'll need your standard [npm](https://www.npmjs.com/) setup with [node](https://nodejs.org/) `v21.7.0` or higher. The site is using [Eleventy](https://11ty.dev/) as static site generator with most documentation pages written in Markdown.

Now, you've got two basic tasks at your disposal:
- `npm run build` builds the site and packages it all up nicely for production.
- `npm run serve` does the whole server + watch thing that you'd want when doing local development.


## About the codebase


This site is built on [Eleventy](https://11ty.dev/), and doesn't have a particularly complicated configuration. There are a few amendments made to the markdown parser; see below for details. Syntax highlighting doesn't happen in the build step; we use [Prism](https://prismjs.com/) to highlight them client-side (asynchronously).

Yozo's source repository is included as submodule to generate output based on version data and to include the archive of all versions on the site.

### Custom Markdown

Eleventy uses [markdown-it](https://markdown-it.github.io/markdown-it/) for Markdown processing. This codebase adds the following changes on top of that:

- Fenced code blocks (i.e. ` ```lang `-style code blocks) output `<ui-code langugage=…>` instead of `<pre class=…>`.
- A special form of inline code is introduced allowing to specify a type (a hint for how to highlight). It's essentially double-backticks-delimited code with the type between the first two backticks: ``` `lang`code…`` ```). It outputs `<ui-icode type…>`. This is not backwards-compatible (i.e. will majorly break things when removed).
- We use the `markdown-it-anchor` plugin to generate anchors for headers.
- We use the `markdown-it-deflist` plugin for definition lists from the extended Markdown syntax.
- Callouts are written like fenced code blocks except they use colons instead of backticks. Specifically they open with `:::type` (where `type` is the type of the callout, e.g. `info` or `warning`) and they close with `:::`. This is a specifically configured version of the `markdown-it-container` plugin.
- Preprocessing is currently disabled, meaning you cannot insert things using `{{ curlies }}`. This is done because Yozo itself uses double-curly braces for interpolation and so those would need to be `{{'{'}}{ escaped }}` every time which is not great.

All this customization means documentation can be written with barely any inline HTML (which is enabled regardless).
