# [WIP] `express-diroutes`

[![Build Status](https://travis-ci.org/zephinzer/express-diroutes.svg?branch=master)](https://travis-ci.org/zephinzer/express-diroutes)
[![Maintainability](https://api.codeclimate.com/v1/badges/9b1ef17e0e27cf901175/maintainability)](https://codeclimate.com/github/zephinzer/express-diroutes/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/9b1ef17e0e27cf901175/test_coverage)](https://codeclimate.com/github/zephinzer/express-diroutes/test_coverage)

## What's This?

A simple package to generate an Express middleware router given a directory structure.

## Usage

To get started, install this via `npm`:

```bash
npm i express-diroutes
```

You can then use it in your application with:

```javascript
const path = require('path');
const expressDiroutes = require('express-diroutes');

expressDiroutes({
  rootPath: path.join(__dirname, './path/to/routes'),
});
```

## The Routes Directory

The routes directory contains files named after their endpoints. The following is an example of how to structure a directory and their corresponding routings:

```
- /{index}.js
- /{star}.js
- /session.js
- /user/create.js
- /user/read.js
- /user/update.js
- /user/delete.js
- /users
- /users/{_}user_id.js
- /profiles/{_}profile_id.js
```

The above directory structure will result in registration of routes:

```
/session
/user/create
/user/read
/user/update
/user/delete
/users
/users/:user_id
/profiles/:profile_id
/*
/
```

## Route String Mappings

The following string mappings will be applied on all filenames to generate the eventual route:

```
{star}  -> *
{index} -> /
{_}     -> :
```

So a file named `a{star}.js` will correspond to the pathname `/a*`.

A file named `{index}.js` will be the root of the pathname, i.e. `/`.

A file named `{_}id.js` will correspond to the pathname `/:id`.

## The Route File

All route files should export a function that returns either an object or an Expres middleware.

### Middleware Export

A route file that exports a middleware will look similar to:

```javascript
module.exports = () =>
  (req, res) => {
    res.json('ok');
  };
```

Given such a route file, `express-diroutes` will call the `.use(...)` method on the Express router.

If the file is named `healthz.js` and is located in a directory named `a` in the `rootPath` specified when instantiating `express-diroutes`, the following method will be called:

```javascript
const router = new express.Router();
// ...
router.use('/a/healthz', require('%_ROOT_PATH_%/a/healthz')());
```

### Object Export

A route file that exports an object should look similar to:

```javascript
module.exports = () => ({
  get: (req, res) => {
    res.json('GET /...');
  },
  post: (req, res) => {
    res.json('POST /...');
  },
});
```

Given such a route file, `express-diroutes` will register the `get` property with the `.get(...)` method on the Express router and the `post` property with the `.post(...)` method on the Express router.

If the file is named `test.js` and is located in a directory named `routes` in the `rootPath` specified when instantiating `express-diroutes`, the following methods will be called:

```javascript
const router = new express.Router();
// ...
router.get('/routes/test', require('%_ROOT_PATH_%/routes/test')().get);
router.post('/routes/test', require('%_ROOT_PATH_%/routes/test')().post);
```

In other words, the properties of the exported object should correspond to an available method on the object returned by `new express.Router()`.

## Contributing

Fork this repository, make your changes and submit a pull request to the `master` branch.
