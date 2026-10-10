Fields declared in an interface are implicitly:

```text
public static final
```

```java
interface Limits {
    int MAX_RETRY = 3;
}
```

`MAX_RETRY` in this example is a constant variable attached to the interface type, not per-instance state of implementing objects. More generally, every interface field is implicitly `public static final`; only fields that also satisfy Java's constant-variable rules are compile-time constants.

An interface field must have an initializer in its declaration. Interface fields are `static final`; they are not assigned later by per-instance constructors:

```java
interface InvalidLimits {
    int MAX_RETRY; // compile error: variable MAX_RETRY not initialized
}
```

`final` prevents the field variable itself from being assigned a different value after initialization. If that value is a reference to a mutable object, the referenced object can still change state. Avoid exposing mutable global state through interface fields.
