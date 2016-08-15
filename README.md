# GitHub Pages Example

In this tutorial we are going to:

1. Create a simple React application
2. Apply some styling using SCSS
3. Write a build script to transpile the JSX down to JavaScript and transpile the SCSS down to CSS
4. Write a watch script to automate the transpilation step
5. Deploy the built files to the `gh-pages` branch
6. Automate deployment of the built files to the `gh-pages` using Travis CI

As you work through this tutorial, remember to commit your code at the end of each section.

## Getting started

Fork this repository and then clone it.

Install the project dependencies:

```
$ npm install
```

This will automatically install the following:

- babel-cli
- babel-preset-react
- node-sass
- browser-sync
- watch

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

Let's copy-paste the commands we used earlier and add them to the `build` script. We can separate them using `&&`

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
scratch every time there is a change to any of the files. This is clearly sub-optimal, but serves as a quick 
demonstration. Perhaps later we can improve it.

## Build testing with Travis CI

Now that you have a build process, it's very useful to determine whether the process works. You can of course do this
manually by running `npm run build` before you check in your code. But you might be collaborating with other developers
who are unfamiliar with the codebase, or you might forget to check the build script works yourself. This is where
automation comes in.

Travis CI allows us to access GitHub webhooks. This means that when an event occurs on GitHub, such as someone raising a
Pull Request, or pushing a commit to a particular branch, Travis can run a command on one of its servers. It can, for 
instance, clone your repo, install all of your dependencies and run your build script. Travis then notifies you as to
whether the build script completed successfully, or whether your build is broken.
 
Why might your build be broken? Perhaps your SCSS is invalid, or you have some missing dependencies, or you don't have
the right permissions to execute a script.
 
### Set up your Travis CI account

  - Go to [https://travis-ci.org/](https://travis-ci.org/)
  - Login with your GitHub account
  - In the sidebar to the left, click `+` next to "My Repositories"
  - Enable the `gh-pages-example` repository
  - In the sidebar to the left, click the `gh-pages-example` repository

### Add a `.travis.yml` file to the repo

In the root directory of the repo, create a file called `.travis.yml`. Notice the `.` at the start of the filename.

In this file, add the following:

```
language: node_js
node_js: 6
script: npm run build
```

### Pushing to `master`

Commit that and push it to GitHub. The following should happen:

1. When you push, a new Travis build will be kicked off. You can monitor this in the Travis dashboard
2. Travis will clone your repo onto one of its servers. It will install Node.js version 6 and then install your 
project's dependencies by running `npm install`
3. Travis will run `npm run build`
4. Finally Travis will attempt to run tests by running `npm test`. We don't have any tests, so this will do nothing

Travis will notify GitHub of whether the build was successful. You can see this by checking the `Commits` tab in GitHub.
There will be a green tick next to the commit it was successful, or a red cross if it was unsuccessful.

Alternatively, you can check the Travis dashboard for your project (browse to `http://travis-ci.org/*yourusername*/*yourrepository*`). You will see a badge next to your project name that 
indicates the status of your most recent build.

### Raising a pull request

Now let's see what happens when you raise a pull request.

First let's create a new feature branch:

```
$ git checkout -b feature-branch-test
```

Make a superficial change to the code. Perhaps update the colour of the `h1` tag in the SCSS.

Commit your change and push the branch:

```
$ git push -u origin feature-branch-test 
```

Browse to your repo on GitHub (`https://github.com/*yourusername*/*yourrepository*`). Click the "New pull request" button.

Make sure `master` is the base branch. For the compare branch, select `feature-branch-test`. Finally click "Create pull
request".

After a few seconds, you'll notice that some build checks start running. You can click through to monitor their progress
on Travis. When the build is complete, there will be a green tick next to the check it was successful, or a red cross if
it was unsuccessful.

If the build was successful, click the "Merge pull request" button.

**Note:** It is still possible to merge a pull request even if the build is failing. Think carefully before doing this
as a failing build indicates that there could be something wrong with your code.

## Deploying to GitHub pages

GitHub pages allows you to commit your code to a special branch in your repository, and anything on that branch is then
served to requests to a special GitHub URL.

You commit your code to a branch called `gh-pages`.

Everything on this branch is accessible by browsing to http://*yourusername*.github.io/*yourrepository*

Let's create a `gh-pages` branch and push it up to GitHub:

```
$ git checkout -b gh-pages
$ git push -u origin gh-pages
```

Now browse to http://*yourusername*.github.io/*yourrepository*. After a few seconds, you should see the website we've 
been working on. 

However, there is a problem. Since the `build` directory is in our `.gitingore`, it hasn't been added to the repo and 
we're getting `404` errors for `build/hello.js` and `build/main.css`. Let's fix this temporarily.

Making sure you're still on the `gh-pages` branch, open up `.gitignore` and remove `build`. Now check in your changes
and push to GitHub. You should no longer be getting `404` errors and your site should look the same as it does in your
development environment.

### The trouble with this approach

While this approach does work, there are a couple of problems.

Firstly, it requires you to commit your source code *and* your built code. This means you have to remember to run `npm 
run build` every time you commit. This may not seem like too much of a chore, but it's easy to forget to do it. It will
become more of an issue as your build process becomes more complex. For instance, you may want to introduce the concept 
of a "development build" and a "production build", with the development build optimised for debugging, and the 
production build optimised for performance.

The second problem with this approach is that there is no safety net. When you push `gh-pages`, your code has to work or
it will break in production. This is a bit scary, especially as your site becomes more complex, the number of 
collaborators grows and the chances of something going wrong increases.

It is therefore safer and more efficient to have an automated build and deployment process that, after you merge changes
into `master`, can generate the code in the `build` folder automatically, perform any tests or quality checks and, if 
everything passes, deploy your code to `gh-pages`. All these steps taken together are called the build and deployment 
pipeline.

### Deployment automation

We are now going to write a deployment pipeline that does the following:

1. When you merge your code into master, Travis kicks off a build on its server
2. If the build passes, Travis clones our repo on its server, checks out the `gh-pages` branch and deletes all of its
contents
3. It then copies the contents the `build` folder and the `index.html` into its local copy of our repo
4. If anything has changed, Travis commits the changes and pushes them up to GitHub using a secure token that is saved 
on Travis' server 

#### The deploy script

The deploy script can be found in [`scripts/deploy.sh`](scripts/deploy.sh)

I found the script [on the Internet](https://gist.github.com/domenic/ec8b0fc8ab45f39403dd). It is not necessary for you 
to understand in detail how exactly this script works. If you understand the 4 points above, that is enough. If you 
don't understand them, follow this process anyway, and hopefully things will become clearer.

#### Update the Travis configuration

We are going to tell Travis to execute the deploy script after it has finished a build. Add the following line to your
`.travis.yml`:

```
after_success: bash ./scripts/deploy.sh
```

#### Get encrypted credentials

You need to give Travis permission to push changes to our repo, but you don't want to add any special keys or passwords 
to your repo. Travis provides a way of doing this.

First, generate a new [GitHub SSH 
key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/). Don't overwrite any 
existing SSH keys, just generate it in the current directory. Don't enter a password for this key. Don't bother adding 
it to your SSH agent.

[Add the key to your GitHub account](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).

Install the [Travis CLI Ruby Gem](https://github.com/travis-ci/travis.rb#installation)

Once installed, run the following command, replacing `deploy_key` with the path to the SSH key you just generated:

```
$ travis encrypt-file deploy_key
```

You may first need to login to Travis using your GitHUb credentials. If so, follow the instructions in the terminal.

Eventually, you'll get something like the following message:

```
encrypting deploy_key for WDOTS/gh-pages-example
storing result as deploy_key.enc
storing secure env variables for decryption

Please add the following to your build script (before_install stage in your .travis.yml, for instance):

    openssl aes-256-cbc -K $encrypted_0a6446eb3ae3_key -iv $encrypted_0a6446eb3ae3_key -in super_secret.txt.enc -out super_secret.txt -d

Pro Tip: You can add it automatically by running with --add.

Make sure to add deploy_key.enc to the git repository.
Make sure not to add deploy_key to the git repository.
Commit all changes to your .travis.yml.
```

Ignore the Pro Tip. Make a note of the magic encryption label (`0a6446eb3ae3` in this example).

You can now delete your `deploy_key`. Commit `deploy_key.enc` to the repo. It's encrypted and safe.

Finally, we need to make one more change to `.travis.yml`:

```
env:
  global:
  - ENCRYPTION_LABEL: "<.... encryption label from previous step ....>"
  - COMMIT_AUTHOR_EMAIL: "you@example.com"
```

Commit all of these changes. Push to GitHub. When the build has finished, assuming it passed, check your `gh-pages` 
branch. You should see that it contains only your `index.html` and `build` directory.

Browse to http://*yourusername*.github.io/*yourrepository* and see if it worked.
