Not every same-named subclass method is an override.

| Case | Runtime overriding? | Remember |
| --- | --- | --- |
| Inherited, overridable instance method with a compatible signature | Yes | Dynamic dispatch |
| `final` instance method | No | Subclass cannot override it |
| `private` method | No | Not an inherited override target |
| Subtype `static` method with the same signature as an inherited superclass `static` method | No | Method hiding |

An override also cannot reduce accessibility and must respect checked-exception compatibility.

Use `@Override` whenever possible because the compiler can catch many relationship/signature mistakes early.

### MAKE THE RULES CONCRETE — visibility, return type, checked exceptions

An override cannot reduce accessibility:

```java
class Parent {
    public Number value() { return 1; }
}

class Child extends Parent {
    @Override
    protected Number value() { return 2; } // compile error
}
```

Reference return types may be covariant:

```java
class Parent {
    Number value() { return 1; }
}

class Child extends Parent {
    @Override
    Integer value() { return 2; } // OK
}
```

For checked exceptions, an override may keep, narrow, or remove the declared checked exception, but it cannot broaden the contract:

```java
class Parent {
    void load() throws IOException {}
}

class Child extends Parent {
    @Override
    void load() throws FileNotFoundException {} // OK
}
```

Using `throws Exception` on `Child.load()` in this example would be illegal because callers of the `Parent` contract would suddenly face a broader checked exception.

### CLASSIFY THE COMMON CONFUSIONS

```text
private method
→ not an inherited override target

final instance method
→ may be inherited but cannot be overridden

inherited static method
→ a same-signature subtype static method is hiding, not runtime overriding

constructor
→ not inherited and never overridden
```

Java also does not let a subtype switch a same-signature method between static and instance form. That is a compile-time conflict, not another overriding variant.
