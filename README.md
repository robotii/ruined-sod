# ruined-sod
A node package for allowing object dispatch based on attributes of the object.

Access the dispatcher by calling `Sod()`, for example:

```javascript
var Sod = require("ruined-sod");
var dispatcher = Sod();
```

This will return the default dispatcher.

To create a new dispatcher, call the function with `true` as a parameter.

```javascript
var dispatcher = Sod(true);
```

The following functions are available on the dispatcher by default.

## Functions

* clear
* dispatch
* add
* findexact
* debug
* find
* remove
