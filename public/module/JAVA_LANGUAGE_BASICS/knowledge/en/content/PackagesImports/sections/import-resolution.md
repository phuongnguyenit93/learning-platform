```java
import java.util.List;
```

does not load the class into the JVM. It helps the compiler/source resolver map the simple name `List` to a type.

If simple names conflict, use a fully qualified name where necessary. `java.lang` is implicitly imported; types in the same package also need no import.

Wildcard imports do not include subpackages:

```java
import java.util.*;
```

does not import types from `java.util.concurrent`.

Imports also do not cause the JVM to eagerly load every matching class; they are source-level name-resolution declarations.

Package names may look hierarchical, but **a subpackage does not inherit package access**:

```text
com.example
com.example.internal
```

are separate packages for access-control purposes. A package-private member in `com.example` is not automatically accessible from `com.example.internal` merely because the names share a prefix.

Java has no general import-alias syntax, so conflicting simple names are commonly resolved by using a fully qualified name for one of the types.
