# cog

cog is a collection of utility modules constructed in a
[browserify](https://github.com/substack/node-browserify) friendly way.

[
![Build Status]
(https://travis-ci.org/DamonOehlman/cog.png)
](https://travis-ci.org/DamonOehlman/cog)

[
![browser support]
(https://ci.testling.com/DamonOehlman/cog.png)
](https://ci.testling.com/DamonOehlman/cog)

## Why would I want to use browserify?

A lot of people don't like/get browserify.  Heck, I was one of those people.
I can say now though, with hand on heart that it is in fact, awesome 
(since V2).  Let me explain why and at the same time explain how cog works.

At a very simple level browserify takes module import statements in the 
form of CommonJS style `require` calls and resolves dependencies into a 
useful self-contained (as self-contained as you like, I might add) script
that can run in your browser.

Not only that, but it only includes the parts of modules that are actually 
used in your code into the final output.  It does this using a technique
called static analysis via a library called [esprima](http://esprima.org/).

## Browserify, NPM and avoiding "bigness"

There's a lot of good stuff that can be learned from the way node and the
node community approaches modularity, which is well voiced in the following
post by @maxogden (which also some info on cool new stuff):

<http://maxogden.com/node-packaged-modules.html>

In a quest to avoid bigness though, sometimes we are creating the opposite
problem of "littleness" which is making it difficult for us as developers
to talk about reusable code that is making our lives easier.  Back when
jQuery was the new hotness, it was really easy to communicate that to 
another developer.  The same can probably be said about things such as
Backbone and Underscore.

So while the bloat that came with those libraries was bad, the ability to 
communicate their usefulness quickly to our friends was not.

I propose a different approach and cog is a demonstration of that. It's the
build a collection of stuff where you only get what you need at runtime 
approach.

So let's get started. Let's do this by checking out some examples
using requirebin.

 
## cog/defaults

```js
var defaults = require('cog/defaults');
```

### defaults(target, *)

Shallow copy object properties from the supplied source objects (*) into 
the target object, returning the target object once completed.  Do not,
however, overwrite existing keys with new values:

```js
defaults({ a: 1, b: 2 }, { c: 3 }, { d: 4 }, { b: 5 }));
```

See an example on [requirebin](http://requirebin.com/?gist=6079475).

 
## cog/extend

```js
var extend = require('cog/extend');
```

### extend(target, *)

Shallow copy object properties from the supplied source objects (*) into 
the target object, returning the target object once completed:

```js
extend({ a: 1, b: 2 }, { c: 3 }, { d: 4 }, { b: 5 }));
```

See an example on [requirebin](http://requirebin.com/?gist=6079475).

## cog/listen

### listen(target, events, capture?)

The `listen` function of cog provides a mechanism for capturing specific
events (named in the events array) and routing them through an
`EventEmitter` that is returned from the function.

While at a base level this has little apparent advantage over the using
the native `addEventListener` and `removeEventListener` methods available
in the browser, the listen function also provides a patched in `stop`
method which will decouple all event listeners from their target.

## cog/logger

```js
var logger = require('cog/logger');
```

Simple browser logging offering similar functionality to the
[debug](https://github.com/visionmedia/debug) module.  

### Usage

Create your self a new logging instance and give it a name:

```js
var debug = logger('phil');
```

Now do some debugging:

```js
debug('hello');
```

At this stage, no log output will be generated because your logger is
currently disabled.  Enable it:

```js
logger.enable('phil');
```

Now do some more logger:

```js
debug('Oh this is so much nicer :)');
// --> phil: Oh this is some much nicer :)
```

### Reference

#### logger(name)

Create a new logging instance.

#### logger.reset()

Reset logging (remove the default console logger, flag all loggers as 
inactive, etc, etc.

#### logger.to(target)

Add a logging target.  The logger must have a `log` method attached.

#### logger.enable(names*)

Enable logging via the named logging instances.  To enable logging via all
instances, you can pass a wildcard:

```js
logger.enable('*');
```

__TODO:__ wildcard enablers

## qsa(selector, element)

This function is used to get the results of the querySelectorAll output 
in the fastest possible way.  This code is very much based on the
implementation in
[zepto](https://github.com/madrobby/zepto/blob/master/src/zepto.js#L104),
but perhaps not quite as terse.
