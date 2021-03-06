Welcome to the REA client application. This project uses [ZenHub](https://www.zenhub.com/) to manage our workflow, please install it and navigate to *'Boards'* to see what is being developed currently.

Note that many issues are logged only for gathering future requirements and exist as placeholders. These are placed into the ZenHub *'icebox'* for later analysis and development and should not be seen as active work items.

<!-- MarkdownTOC -->

- [Getting started](#getting-started)
    - [Nodejs](#nodejs)
    - [Package Manager](#package-manager)
    - [Development tools](#development-tools)
        - [Linting](#linting)
        - [Typescript](#typescript)
    - [Setting up the codebase](#setting-up-the-codebase)
- [Running locally for development](#running-locally-for-development)
    - [Recommended editor plugins](#recommended-editor-plugins)
    - [Environment variables](#environment-variables)
    - [Running package commands individually](#running-package-commands-individually)
- [Frameworks & conventions used](#frameworks--conventions-used)

<!-- /MarkdownTOC -->


## Getting started

Here are the things you'll need to run this project and details on how to configure them.

### Nodejs

The latest release of node at time of writing is `7.7.2`. You should be able to run with any other `7.x` version, but this is untested; some tools depend on particular node versions.

The best way to install node for development is to [install NVM](https://github.com/creationix/nvm) and then run `nvm install 7.7.2`. This allows you to easily run different node versions for different projects. If you use NVM, you may also wish to add this to your `.bashrc`, which will ensure your node version is synced with any projects which define an `.nvmrc` file:

```
cd () { builtin cd "$@" && chNodeVersion; }
pushd () { builtin pushd "$@" && chNodeVersion; }
popd () { builtin popd "$@" && chNodeVersion; }
chNodeVersion() {
    if [ -f ".nvmrc" ] ; then
        nvm use;
    fi
}
chNodeVersion;
```

Note that any commands installed via NPM or Yarn will only be available if you are using the same node version as was active at install time.

### Package Manager

This repository actually uses _two_ package managers: [Lerna](https://lernajs.io/) & [Yarn](https://yarnpkg.com/). Lerna manages multi-package repositories (like this one), Yarn does the same thing as node's built-in package manager (NPM), but is much faster at it.

Before starting, you must install Yarn globally. Contrary to the install instructions, the easiest way to install is via NPM: `npm i -g yarn`. Note however the following caveats:

- If installed via NPM then Yarn is only available for the node version it was installed in.
- Current versions of Yarn (0.17.x - 0.21.3) install global modules to their own location which does not play nicely with NVM. Use `npm i -g` instead of `yarn global add` for installing global packages, but feel free to use Yarn for all other package-related tasks.

### Development tools

- The [Redux Devtools Extension](http://extension.remotedev.io/) is a must-have for time-travel debugging and inspection of app state changes.
- The [Redux dispatch CLI](https://github.com/jhen0409/redux-dispatch-cli) is a nice way of firing actions to the dispatcher for testing your app: `npm i -g redux-dispatch-cli`

#### Linting

Linters are basically a requirement for writing 'good' JavaScript code, since there are so many 'bad' ways to do it. This will also keep your code style aligned with other contributors.

**1. Install tslint**. You will need at least tslint `5.3.2`.
    
    npm i -g typescript tslint tslint-react tsutils

**2. Setup your editor**.

*Sublime Text 3:*

- Install [Package Control](https://packagecontrol.io/) if you haven't already
- Install [SublimeLinter](http://www.sublimelinter.com/)
- Also install the package `SublimeLinter-contrib-tslint`
- Check your linter settings (*Preferences > Package Settings > SublimeLinter > Settings [User]*). Ensure your linters are enabled under `user.linters` and that your node paths are set correctly under `user.paths`. Note that the global node packages must be installed in the same node version as you specify here.
- Use the command *SublimeLinter: Enable Debug Mode* and bring up the ST console (`CTRL/CMD + ~`) if you need more help!

*Other editors*

Please add instructions here!

#### Typescript

We use [Typescript](https://typescriptlang.org) to author the app. Typescript is a typed superset of JavaScript, which adds a lot of code intelligence and safety features on top of JS.

Something you might need to be aware of from time to time with Typescript is that TS modules, standard nodejs modules (ie. 'commonjs') and ES6 JavaScript modules are all slightly different formats; and you will have to deal with them differently.

- For TS modules: `import myModule from 'mymodule'` works fine, as does `import { something } from 'mymodule'`.
- For ES6 modules: things are compatible with the Typescript import syntax for the most part and the above should also work.
- For commonjs modules: `import * as myModule from 'mymodule'` is required, as there is no such thing as a 'default export'. The abbreviated form will error.

*(Note: Babel is still used in the codebase, but only to process files generated by the SVG loader plugin.)*

### Setting up the codebase

Now that you have all the prerequisites ready, you can setup the project. Clone this repo, then:

- Run `yarn` to install all dependencies



## Running locally for development

- `npm run dev` to spin up a development server

### Recommended editor plugins

- [tslint](https://palantir.github.io/tslint/) code quality checker
- [Editorconfig](http://editorconfig.org/) support

### Environment variables

The app accepts the following env vars to control its behaviour:

- `NODE_ENV`: as usual, set to `production` to run a non-debug build, omit to use debug mode or set to `test` when running tests.
- `IP` and `PORT` specify the interface and port to listen on. Defaults to `0.0.0.0:3000`. If running in development, the `webpack-dev-server` will be run on `(port + 1)`.
- `API_URL`: sets the base path to the OCP API. If not provided will default to `http://localhost:8000/api` for connecting to a local instance.
- `PUBLIC_PATH` sets the base URL to the website. If not provided, will default to `/`.

### Running package commands individually

Since the repository is setup with Lerna, often when you try to run NPM commands within each packge rather than at the top level they won't be able to find the right dependencies. To workaround this, simply use Lerna's `scope` option to target the specific package, for example: `lerna run --scope @vflows/views test`.



## Frameworks & conventions used

- UI architecture based on [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/) principles.
- CSS is written with modern W3C css and processed via [PostCSS](https://www.npmjs.com/package/postcss) plugins. See http://cssnext.io/features/
    - *Caveat:* local files must be imported with **double quotes**! Otherwise, `postcss-import` won't combine them correctly.
- Built with [pure view components](https://medium.com/@joshblack/stateless-components-in-react-0-14-f9798f8b992d) (`packages/ui-views`) bound to [Redux](http://redux.js.org/) by way of [higher-order components](https://facebook.github.io/react/docs/higher-order-components.html) (`packages/ui-bindings`). Essentially the design goal is enforcing one-way dataflow and separation of concerns, this is done by writing the UI as simple functional transforms of `props` data (pure view components) which bind to a single application state (in Redux) by way of accessor functions which pull the data out (higher-order components). All data going back in is sent through Redux's reducers by way of firing a Redux action.
