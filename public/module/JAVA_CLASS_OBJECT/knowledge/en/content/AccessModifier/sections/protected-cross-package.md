`protected` is more subtle than “subclasses can access it”. Across packages, access also depends on subclass context and the qualifying reference.

A subclass in another package cannot arbitrarily use a protected member through every superclass instance.

For example, assume `Parent` is declared in package `a` with a protected field:

```java
package a;

public class Parent {
    protected int value;
}
```

Then a subclass in package `b` may use the inherited member through its own subclass context, but not through an arbitrary `Parent` reference:

```java
package b;

import a.Parent;

class Child extends Parent {
    void allowed(Child other) {
        this.value = 1;
        other.value = 2;
    }

    void rejected(Parent other) {
        // other.value = 3; // compile-time error
    }
}
```

This is why `protected` should be learned as a precise language rule, not as the shortcut “subclasses can always access it”.
