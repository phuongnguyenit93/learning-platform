An annotation type is declared with `@interface`:

```java
public @interface Audit {
    String action();
    int level() default 1;
}
```

The declaration creates an annotation interface. Its members describe the metadata that each annotation use may supply.

```java
@Audit(action = "PAYMENT")
void pay() {
}
```

Annotation elements look like no-argument methods in the declaration, but they are not ordinary behavior methods. They cannot declare parameters, type parameters, or a `throws` clause, and their return types must follow the annotation-element restrictions described below.

The annotation interface itself is also a specialized language construct. Its direct superinterface is `java.lang.annotation.Annotation`; writing an ordinary interface that extends `Annotation` does not make that interface an annotation type. An annotation interface cannot be generic and does not declare an arbitrary `extends` clause. Its element declarations are metadata accessors, not normal `static`, `default`, or `private` interface behavior methods.

### MENTAL MODEL — schema before consumer

Think of the annotation type as a small schema:

```text
@interface Audit
→ defines which metadata fields exist

@Audit(action = "PAYMENT")
→ supplies one metadata instance

processor/framework/reflection code
→ reads and interprets that instance
```

Declaring an annotation does not automatically register framework behavior. A consumer must still be written or configured.
