# COG

Cog is a collection of useful routines that I have used in various libraries.  For the most part, these 'routines' are design to be embedded within another JS library, although they could be wrapped up into a single utility library.

## Available COGs

The following is a list of available cogs:

### Properties Parser 

`cogs/parseprops.js`

This COG provides a functionality to parse a a string of property values and return an object literal with the property values.

```js
console.log(_parseprops('x100 y100'));
```

which yields:

```
{
	x: 100,
	y: 100
}
```