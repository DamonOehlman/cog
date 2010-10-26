Currently doing a bit of rework here with the idea being that COG becomes a really useful collection of self-contained (where possible) javascript modules that make building javascript libraries simpler.

I hate reinventing the wheel, and I tend to like the way x framework does this and the way y framework does that and it frustrates me that there are no easy ways to aggregate something at a more granular level.  So COG will attempt to solve this at two levels:

* Provide some useful javascript client side libraries abstracted in sensible ways.  While I think [CommonJS](http://commonjs.org/) has definitely got the potential to do some great things in the long term, I'm not patient enough to wait for it to be *really* useful for browser JS.

* Provide a build tool that includes a COG preparser to pull in particular COGS (either by latest stable version or specific release) into a build.  Ideally using a simple CURL get of the library from Github potentially using a git tag (or something). 

Anyway that's all for now.

-Damon