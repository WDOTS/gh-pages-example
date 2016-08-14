# GitHub Pages Example

In this tutorial we are going to:

1. Create a simple React application
2. Apply some styling using SCSS
3. Write a build script to transpile the JSX down to JavaScript and transpile the SCSS down to CSS
4. Write a watch script to automate the transpilation step
5. Deploy the built files to the `gh_pages` branch
6. Automate deployment of the built files to the `gh_branch` using Travis CI

As you work through this tutorial, remember to commit your code at the end of each section.

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

## Improving the build

### One step build

At the moment, to build our code, we need to manually type 2 commands into the terminal. Let's make this easier.

Open up the `package.json`. Under the `scripts` section we're going to add a new property called `build`.

Let's copy-paste the commands we use earlier and add them to the `build` script. We can separate them using `&&`

```
  "scripts": {
    // ...
    "build": "babel src/js/hello.js --out-file hello.js && node-sass src/styles/main.scss main.css"
  }
```

Now try running the following in the terminal:

```
$ npm run build
```

Can you see what has happened? Pretty cool stuff. 

You can update the name `build` to pretty much anything you want:

```
  "scripts": {
    // ...
    "cupcakes": "babel src/js/hello.js --out-file hello.js && node-sass src/styles/main.scss main.css"
  }
```

You can then run:

```
$ npm run cupcakes
```

Sweet!

### Watch

Let's build a simple watch script that watches all our source files and runs the `build` script whenever they change.

Run the following from the command line:

```
$ watch "npm run build" src/**/
```

Now make some changes to `src/js/hello.js` and `src/styles/main.scss`. Notice how when the files are changed, the build 
script is automatically triggered.

Let's add this to our `package.json` scripts:

```
  "scripts": {
    // ...
    "watch": "watch \"npm run build\" src/**/"
  }
```

Now we can start the `watch` script from the command line using:

```
$ npm run watch
```

### Built code organisation

It's a bit untidy having all our built code output in the root directory. Let's give them their own folder.

By convention, it is common to build our code into a directory called `build` or `dist`. Choose whichever you prefer,
but for this tutorial we're going to call it `build`.

We'll add a new script that removes the `build` directory if it exists, and then makes it again. We'll call this new
script `clean`:

```
  "scripts": {
    // ...
    "clean": "rm -rf build/ && mkdir build"
  }
```

Now let's update the build script to first run `clean`. We'll also update the output locations for our built files:

```
  "scripts": {
    // ...
    "build": "npm run clean && babel src/js/hello.js --out-file build/hello.js && node-sass src/styles/main.scss build/main.css"
  }
```

We'll also need to update `index.html` to point to the new locations of the built JavaScript and CSS files:


```
<link rel="stylesheet" href="build/main.css">

// ...

<script src="build/hello.js"></script>
```

Run the `watch` script and start making changes to the source files. Make sure everything is working as expected.

**A note on performance:** You may have noticed that it's really slow to delete the `build` file and rebuild it from 
scratch every time there is a change to any of the files. I'll leave it as an exercise for you to come back later and 
optimise the build and watch scripts.

## Deploying to GitHub pages

GitHub pages allows you to commit your code to a special branch in your repository, and anything on that branch is then
served to requests to a special GitHub URL.

You commit your code to a branch called `gh_pages`.

Everything on this branch is accessible by browsing to http://*yourusername*.github.io/*yourrepository*

Let's create a `gh_pages` branch and push it up to GitHub:

```
$ git checkout -b gh_pages
$ git push
```

Now browse to http://*yourusername*.github.io/*yourrepository*. After a few seconds, you should see the website we've 
been working on. We can call this our *production environment*. 

However, there is a problem. Since the `build` directory is in our `.gitingore`, it hasn't been added to the repo and 
we're getting `404` errors for `build/hello.js` and `build/main.css`. Let's fix this temporarily.

Making sure you're still on the `gh_pages` branch, open up `.gitignore` and remove `build`. Now check in your changes
and push to GitHub. You should no longer be getting `404` errors and your site should look the same as it does in your
development environment.

### The trouble with this approach

While this approach does work, there are a couple of problems.

Firstly, it requires you to commit your source code *and* your built code. This means you have to remember to run `npm 
run build` every time you commit. This may not seem like too much of a chore, but it's easy to forget to do it. It will
become more of an issue as your build process becomes more complex, for instance if you want to introduce the concept of 
"development build" and a "production build", with the development build built to optimise the ability for the developer
to debug, and the production build optimised for performance.

The second problem with this approach is that there is no safety net. When you push `gh_pages`, your code has to work or
it will break in production. This is a bit scary, especially as your site becomes more complex, the number of 
collaborators grows and the chances of something going wrong increases.

It is therefore safer and more efficient to have an automated build and deployment process that can generate the code in
your `build` folder automatically, perform any tests or quality checks and, if everything passes, deploys your code up
to your production environment. All these steps taken together are called the build and deployment pipeline.

### Build automation

Coming soon

### Deployment automation

Coming soon
