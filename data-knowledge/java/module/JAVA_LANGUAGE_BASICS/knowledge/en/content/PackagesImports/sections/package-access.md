Omitting an access modifier gives package-private visibility where the language allows it.

That lets types within one package collaborate without exposing every helper/member as public API.

A package can therefore form an encapsulation boundary for a group of types.

Helpers that do not belong in the public contract often do not need `public` visibility:

```java
class OrderValidator {
    boolean valid(Object order) {
        return order != null;
    }
}
```

This keeps external API surface smaller while allowing collaboration inside the package. Detailed access-modifier rules belong to later class/OOP modules; here the key model is package = namespace + possible access boundary.

### Package-name hierarchy is not an access hierarchy

For example:

```java
// package com.example;
class InternalHelper {
    static void run() { }
}
```

code declared in:

```java
package com.example.internal;
```

is not considered to be "inside the parent package" `com.example` for package-private access. Crossing that package boundary requires an appropriately visible API rather than relying on a shared name prefix.

The next chapter brings the module's compile-time and runtime type boundaries together.
