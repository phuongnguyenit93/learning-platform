A subinterface may redeclare an inherited method to:

- add documentation or annotations;
- narrow a return type covariantly;
- clarify the contract exposed by the child interface.

```java
interface Base {
    Number value();
}

interface Specific extends Base {
    @Override
    Integer value();
}
```

`Integer` is a narrower return type that remains compatible with `Number`, so the child interface can refine the contract this way.

Redeclaration should clarify or refine the contract rather than merely repeat the same signature.

Next we examine why modern interfaces support `default`, `static`, and `private` methods and what problem each kind solves.
