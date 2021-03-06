# Javascript Object Sanitizer

[![npm version](https://badge.fury.io/js/%40asanrom%2Fjavascript-object-sanitizer.svg)](https://badge.fury.io/js/%40asanrom%2Fjavascript-object-sanitizer)

Object sanitizer for javascript and typescript.

Forces the input to follow a pre-defined schema. Useful to check `application/json` bodies in web requests and responses from untrusted APIs.

## Installation

If you are using a npm managed project use:

```
npm install @asanrom/javascript-object-sanitizer
```

If you are using it in the browser, download the minified file from the [Releases](https://github.com/AgustinSRG/javascript-object-sanitizer/tags) section and import it to your html:

```html
<script type="text/javascript" src="/path/to/javascript-object-sanitizer.js"></script>
```

## Usage

Node:

```ts
import { ObjectSchema } from '@asanrom/javascript-object-sanitizer';

// With require: const ObjectSchema = require('@asanrom/javascript-object-sanitizer').ObjectSchema;

// Example schema or complex object
const schema = ObjectSchema.object({
    stringProperty: ObjectSchema.string().withDefaultValue(""),
    integerProperty: ObjectSchema.integer(),
    positiveNumber: ObjectSchema.number().withMin(0),
    array: ObjectSchema.array(ObjectSchema.object({
        arrayItemProp1: ObjectSchema.boolean(),
    })),
    optionalProperty: ObjectSchema.optional(ObjectSchema.number()),
});

// Test user input
schema.test(userInput); // Returns true or false

// Sanitize
const sanitized = schema.sanitize(userInput); // Forces user input to follow the schema
```

Browser:

```js
window.ObjectSchema = ObjectSanitizer.ObjectSchema;

// Example schema or complex object
const schema = ObjectSchema.object({
    stringProperty: ObjectSchema.string().withDefaultValue(""),
    integerProperty: ObjectSchema.integer(),
    positiveNumber: ObjectSchema.number().withMin(0),
    array: ObjectSchema.array(ObjectSchema.object({
        arrayItemProp1: ObjectSchema.boolean(),
    })),
    optionalProperty: ObjectSchema.optional(ObjectSchema.number()),
});

// Test user input
schema.test(userInput); // Returns true or false

// Sanitize
const sanitized = schema.sanitize(userInput); // Forces user input to follow the schema
```

## Documentation

 - [Library documentation (Auto-generated)](https://agustinsrg.github.io/javascript-object-sanitizer/)
