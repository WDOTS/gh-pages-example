# GitHub Pages Example

In this tutorial we are going to:

1. Create a simple React application
2. Apply some styling using SCSS
3. Write a build script to transpile the JSX down to JavaScript and transpile the SCSS down to CSS
4. Write a watch script to automate the transpilation step
5. Deploy the built files to the `gh_pages` branch
6. Automate deployment of the built files to the `gh_branch` using Travis CI

## Getting started

Fork this repository and then clone it.

Install the project dependencies:

```
$ npm install
```

Start the dev server:

```
$ npm start
```

You can access the dev server by browsing to [http://localhost:3000](http://localhost:3000)

Notice the error you are getting in the console:

> hello.js:4 Uncaught SyntaxError: Unexpected token <

This is because we are trying to load untranspiled JSX into the browser. Let's sort this out.

## Transpiling the JSX down to JavaScript

We are going to use the Babel CLI to transpile the JSX down to vanilla JavaScript.

First we need to create `.babelrc` file, that will contain the configuration for Babel:

```
{
  "presets": ["react"]
}
```

Now let's try running Babel CLI to do the actual transpiling:

```
$ babel src/js/hello.js --out-file hello.js
```

Notice that after you run this, a new file called `hello.js` is created in the root directory.

Have a look inside. Notice that there is no JSX, it's all vanilla JavaScript.

Let's update the `index.html` to point to the built file instead of the pristine source file:

```
<script src="hello.js"></script>
```

Refresh the browser. You should now see the React component on the page, with no errors in the console.

## Transpiling the SCSS down to CSS

We are going to use the node-sass CLI to transpile the SCSS down to vanilla CSS.

```
$ node-sass src/styles/main.scss main.css
```

Notice that after you run this, a new file called `main.css` is created in the root directory.

Have a look inside. Notice that there is no SCSS, it's all vanilla CSS.

Let's update the `index.html` to point to the newly built file. In the `<head>`, add the following:

```
<link rel="stylesheet" href="main.css">
```

Refresh the browser. Notice that the header has turned a tasteful shade of red.
