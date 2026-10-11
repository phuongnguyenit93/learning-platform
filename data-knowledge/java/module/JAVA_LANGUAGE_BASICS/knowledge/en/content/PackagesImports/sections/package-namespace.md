```java
package com.example.order;
```

makes `Order` part of the fully qualified name `com.example.order.Order`.

Different packages may contain the same simple class name.

Packages also participate in access control, not merely folder organization.

By convention, source directories mirror package names:

```text
src/main/java/com/example/order/Order.java
                    ↓
package com.example.order;
```

The important language concept is still that the package declaration contributes to the fully qualified name. The directory layout is a strong tooling/build convention rather than the definition of a package itself.

Production code normally uses lower-case, reverse-domain-style package names and avoids the unnamed/default package except for tiny experiments.
