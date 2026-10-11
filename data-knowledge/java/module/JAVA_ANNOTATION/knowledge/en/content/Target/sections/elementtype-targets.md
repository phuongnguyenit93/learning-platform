`@Target` accepts one or more `ElementType` constants:

```java
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}
```

Now this is valid:

```java
class PaymentService {
    @Audit(action = "PAYMENT")
    void pay() {
    }
}
```

but applying `@Audit` to a class is rejected because the annotation contract says it belongs on methods.

Java 21's `ElementType` includes locations such as:

```text
TYPE
→ class, interface (including annotation interface), enum, record declaration

FIELD
→ field declaration

METHOD
→ method declaration

PARAMETER
→ formal parameter declaration

CONSTRUCTOR
→ constructor declaration

LOCAL_VARIABLE
→ local variable declaration

ANNOTATION_TYPE
→ annotation interface declaration

PACKAGE / MODULE
→ package or module declaration

TYPE_PARAMETER
→ type parameter declaration such as <@A T>

TYPE_USE
→ use of a type in supported type contexts

RECORD_COMPONENT
→ record component declaration
```

### Where do `PACKAGE` and `MODULE` annotations appear?

These targets are easy to misread because they are not written inside an ordinary class.

A package annotation is typically placed in `package-info.java`:

```java
@InternalPackage
package com.example.payment;
```

A module annotation appears in `module-info.java`:

```java
@InternalModule
module com.example.payment {
    exports com.example.payment.api;
}
```

The mental model is unchanged: the annotation describes the **package declaration** or **module declaration**, and a consumer must define what that metadata means.

If an annotation type has no `@Target`, it is applicable in **all declaration contexts**, including type-parameter and record-component declarations, but in **no type contexts**. `TYPE_USE` is therefore still an explicit opt-in for annotating uses of types.
