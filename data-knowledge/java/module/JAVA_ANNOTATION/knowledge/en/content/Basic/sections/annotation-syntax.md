An annotation use begins with `@` followed by the annotation type name:

```java
@Override
public String toString() {
    return "payment";
}
```

A custom annotation may declare named **elements**. Supplying an annotation is similar to supplying a small immutable metadata record:

```java
@Audit(action = "PAYMENT", level = 2)
void pay() {
}
```

If an annotation has an element named `value`, Java permits a shorthand when that is the only element being supplied:

```java
@Label("core")
class PaymentService {
}
```

instead of:

```java
@Label(value = "core")
class PaymentService {
}
```

Multiple annotation elements are separated by commas, and array-valued elements use braces when multiple values are present:

```java
@RolesAllowed({"admin", "auditor"})
void export() {
}
```

Annotation values are part of the declaration metadata. They are not arbitrary runtime expressions evaluated when the annotated method executes.

The values written in an annotation use must also be representable by Java's annotation-value model at compile time: compatible constant expressions, class literals, enum constants, nested annotations, or arrays of valid annotation values. An annotation value cannot be produced with an arbitrary method call or `new SomeObject()` expression.

The next chapter examines annotations from the JDK itself. They show an important pattern: an annotation becomes useful only when a consumer gives its metadata a precise contract.
