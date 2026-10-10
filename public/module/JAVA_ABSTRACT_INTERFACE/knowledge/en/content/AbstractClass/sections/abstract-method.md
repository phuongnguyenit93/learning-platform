### CONCEPT

An abstract method declares a method signature without a body:

```java
abstract void pay(int amount);
```

A concrete subclass must ensure that every abstract requirement has a compatible implementation before the type can be instantiated. The subclass does not have to declare the method itself when it already inherits a compatible concrete implementation from an intermediate superclass.

### MECHANICS

Abstract methods follow normal Java overriding rules:

- visibility must remain compatible;
- return types must remain compatible, including covariant returns where allowed;
- checked exceptions must follow overriding rules;
- `@Override` lets the compiler verify the intended relationship.

`abstract` does not introduce a special dispatch model. Once a concrete subclass supplies an implementation, ordinary instance-method dynamic dispatch applies.
