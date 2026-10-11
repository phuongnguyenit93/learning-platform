When a class overrides a conflict, it may explicitly invoke a default method from an appropriate **direct superinterface**:

```java
@Override
public String name() {
    return A.super.name() + B.super.name();
}
```

`InterfaceName.super.method()` lets the class combine default behavior instead of reimplementing everything.
