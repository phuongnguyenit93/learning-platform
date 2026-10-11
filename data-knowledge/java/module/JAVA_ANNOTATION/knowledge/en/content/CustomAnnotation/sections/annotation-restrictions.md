Annotation elements intentionally support a restricted set of types. An element type may be:

- a primitive type;
- `String`;
- `Class` or a parameterized use such as `Class<? extends Handler>`;
- an enum type;
- another annotation type;
- a one-dimensional array whose component type is one of the allowed types above.

For example:

```java
@interface EndpointInfo {
    String path();
    int version() default 1;
    Class<?> handler();
    HttpMethod method();
    Tag tag();
    String[] roles() default {};
}
```

Arbitrary domain objects are not valid element types:

```java
@interface InvalidMetadata {
    // PaymentPolicy policy(); // compile error: invalid annotation element type
}
```

Nested array element types are also not allowed. The restriction keeps annotation values representable in class-file metadata and available to compiler/runtime tooling without constructing arbitrary application objects.

`null` is not a valid annotation element value. Model optional metadata with a meaningful default, an enum sentinel, or a separate annotation design rather than using `null` as an implicit state.

### Annotation elements cannot form dependency cycles

Although another annotation type is a legal element type, annotation interfaces may not refer to themselves through element types, directly or indirectly:

```java
// Invalid: direct self-reference
@interface A {
    A value();
}

// Invalid: cycle A -> B -> A
@interface B {
    C value();
}

@interface C {
    B value();
}
```

Cyclic annotation-element declarations are compile-time errors; the metadata schema must remain finitely representable by the compiler/class-file model.

### Element signatures cannot collide with the `Object` / `Annotation` contract

Annotation elements look like no-argument methods, but an annotation interface may not declare an element whose signature is override-equivalent to a public/protected method of `Object` or `java.lang.annotation.Annotation`.

For example:

```java
public @interface InvalidMetadata {
    // int hashCode();          // invalid
    // String toString();       // invalid
    // Class annotationType();  // invalid
}
```

Methods such as `equals(...)`, `hashCode()`, `toString()`, and `annotationType()` belong to the common annotation-instance contract; they are not metadata elements for an annotation author to redefine.
