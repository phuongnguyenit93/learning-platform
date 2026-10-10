`this` escape happens when a reference to the under-construction object is published before construction completes.

Examples include registering `this` in a global registry or listener from the constructor.

External code may then observe partially initialized state. In concurrent code, premature publication creates even more serious visibility hazards.

Next we move from lifecycle to type organization: nested and inner classes.
