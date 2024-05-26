# YOZO.OOO

The documentation site for Yozo.

Website: [yozo.ooo](https://yozo.ooo/) \
Yozo source: [vrugtehagel/yozo](https://github.com/vrugtehagel/yozo)

## Getting started

To start developing, you'll need an up-to-date installation of [Deno](https://deno.com/) installed. The site is using [Eleventy](https://11ty.dev/) as static site generator with most documentation pages written in Markdown.

To get started, these are the two basic tasks at your disposal:
- `deno task build` builds the site and packages it all up nicely for production.
- `deno task serve` does the whole server + watch thing that you'd want when doing local development. By default, the local server uses [localhost:8787](http://localhost:8787/) but of course you're welcome to change the port (see the `serve` task in `deno.json`). Note that this does _not_ build Yozo's source, so if you want to also make changes to the `yozo/` submodule, you'll need to run both this and Yozo's watcher at the same time.

## About the codebase

This site is built on [Eleventy](https://11ty.dev/), and doesn't have a particularly complicated configuration. There are a few amendments made to the markdown parser; see below for details. Syntax highlighting doesn't happen in the build step; we use [Prism](https://prismjs.com/) (downloaded manually, instead of through a package manager) to highlight code client-side, asynchronously.

Yozo's source repository is included as submodule to generate output based on version data, to include the archive of all versions, and to include tests on the site.

### Custom Markdown

Eleventy uses [markdown-it](https://markdown-it.github.io/markdown-it/) for Markdown processing. This codebase adds the following changes on top of that:

- We use the [markdown-it-anchor](https://www.npmjs.com/package/markdown-it-anchor) plugin to generate anchors for headers.
- We use the [markdown-it-deflist](https://www.npmjs.com/package/markdown-it-deflist) plugin for definition lists from the extended Markdown syntax.
- Fenced code blocks (i.e. ` ```lang `-style code blocks) output `<ui-code langugage=…>` instead of `<pre class=…>`.
- A special form of inline code is introduced allowing to specify a type (a hint for how to highlight). It's similar to some already-existing Markdown extensions doing this, though not exactly the same; code may be followed by the language enclosed in curly braces, like `` `code…`{type} ``. It outputs `<ui-icode type=…>`.
- Callouts are written like fenced code blocks except they use colons instead of backticks. Specifically they open with `:::type` (where `type` is the type of the callout, e.g. `info` or `warning`) and they close with `:::`. More specifically, they output `<ui-callout type=…>`. This syntax is a specifically configured version of the [markdown-it-container](https://www.npmjs.com/package/markdown-it-container) plugin.
- Preprocessing inside Markdown is currently disabled, meaning you cannot insert things using `{{ curlies }}`. This is done because Yozo itself uses double-curly braces for interpolation and so those would need to be `{{'{'}}{ escaped }}` every time which is not great.

All this customization lets us write documentation with barely any inline HTML.

### Yozo's tests

Since [Yozo's repository](https://github.com/vrugtehagel/yozo) defines the tests, we generate them just from the files specified there. The tests are defined in the `test/` folder (again, this is in Yozo's repository) in the same structure as the `/docs/` pages. The tests are included in their respective page in the documentation. They do not run by default, but may be run manually by the user on a page-by-page basis, or automatically run on page visit (site users can opt-in to that behavior in the site settings in the footer).

To build this part of the site, we clone the `test/` folder from the submodule into `/test/`. Then, we generate sandbox pages for each page in the documentation from `src/docs/sandboxes.liquid`. The generated `sandbox.html` files are not to be visited by users, but are loaded in a hidden iframe when tests are run.
