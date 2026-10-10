An overriding method may narrow a **reference return type** to a subtype of the parent's return type.

```java
class Parent {
    Animal create() { ... }
}

class Child extends Parent {
    @Override
    Dog create() { ... }
}
```

`Dog` is a subtype of `Animal`, so the supertype contract remains valid while callers that know `Child` get a more precise return type.

Primitive return types do not participate in covariant returns in this sense.
