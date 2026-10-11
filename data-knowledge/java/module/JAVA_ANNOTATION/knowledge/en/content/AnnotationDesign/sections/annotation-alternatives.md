Do not turn annotations into containers for:

- complex business logic;
- rapidly changing runtime data;
- secrets;
- large environment-dependent configuration;
- values that must change frequently without recompiling the application;
- dynamic object graphs.

If the information belongs more naturally in an object, database, or configuration file, use that mechanism instead.

A practical comparison:

| Need | Often clearer mechanism |
| --- | --- |
| Small, stable declarative facts attached to code | Annotation |
| Require a type to provide behavior | `interface` / abstract type |
| Require a caller to invoke an operation explicitly | Method / explicit API |
| Deployment-specific values | Configuration file / environment / configuration object |
| Frequently changing runtime data | Object / database / service |
| Secrets | Secret store / secure configuration mechanism |

For example, if every service must implement `audit()`, an interface may communicate that behavioral contract more directly than a marker annotation.

If the requirement is instead **“this method should be observed by an auditing component”**, an annotation may be a better fit because the information describes the method rather than a method the object must implement itself.
