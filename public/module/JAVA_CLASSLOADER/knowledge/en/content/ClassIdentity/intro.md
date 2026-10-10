# Class Identity Across Loaders

Java source code encourages us to identify a type by its fully qualified name. At runtime that is not enough. Class loaders create separate namespaces, so two classes can have the same binary name and still be different, incompatible runtime types.

This rule is the reason plugin APIs must be shared deliberately and the reason many confusing `ClassCastException` messages are really loader-boundary problems.
