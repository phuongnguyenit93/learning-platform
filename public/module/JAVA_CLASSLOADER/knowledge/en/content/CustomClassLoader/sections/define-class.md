Reading bytes does not create a Java runtime type. The transition happens through `defineClass`.

Conceptually:

```java
byte[] bytes = ...;
Class<?> type = defineClass(binaryName, bytes, 0, bytes.length);
```

`defineClass` asks the JVM to create a runtime `Class<?>` associated with **this defining loader** and performs definition-time name, format, and security checks as required. Verification is conceptually part of linking and may be performed eagerly by the JVM; it should not be collapsed into the definition step itself.

Several consequences follow immediately:

- the binary name in the request must agree with the class-file identity;
- one loader cannot successfully define the same binary name twice;
- defining a class does not by itself mean its static initialization has run;
- the defining loader becomes part of the type's runtime identity;
- ordinary custom loaders cannot define classes in protected `java.*` packages.

A second attempt to define a name already defined by the same loader results in a linkage failure. This is why a custom loader should participate in the normal `loadClass` protocol instead of calling `defineClass` blindly on every request.

> **Advanced — safe to skip on the first pass:** `defineClass` also has overloads that accept a `ProtectionDomain`. Signed JARs and package certificate/sealing rules introduce additional production concerns. This module only needs the boundary to be visible; it does not teach the full protection-domain or signing model.
