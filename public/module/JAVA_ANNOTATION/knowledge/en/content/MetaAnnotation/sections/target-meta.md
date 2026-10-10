`@Target` declares the program locations at which an annotation type may appear.

```java
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface FeatureFlag {
    String value();
}
```

The compiler enforces this target contract at annotation use sites.

For the `@Audit` example, method-only targeting keeps the metadata aligned with a consumer that intercepts operations:

```java
@Target(ElementType.METHOD)
public @interface Audit {
    String action();
    int level() default 1;
}
```

Retention and target should be designed together but answer separate dimensions:

```text
@Retention
→ when is metadata still available?

@Target
→ where is metadata legal?
```

### Custom meta-annotations and the composition boundary

Meta-annotations are not limited to the JDK's predefined annotation types. An application or framework can define metadata whose target is another annotation type:

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.ANNOTATION_TYPE)
public @interface FrameworkStereotype {
}

@FrameworkStereotype
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface AuditedComponent {
}
```

Here `@FrameworkStereotype` describes the annotation type `@AuditedComponent` itself.

Java Core does **not** automatically turn that relationship into transitive/composed annotation semantics:

```java
@AuditedComponent
class PaymentService {
}
```

`PaymentService` is not automatically directly annotated with `@FrameworkStereotype`. A framework that supports stereotypes, composed annotations, or recursive meta-annotation lookup must define and implement that traversal itself.

```text
Java Core meta-annotation
→ metadata on an annotation type

framework composition
→ framework actively traverses/interprets meta-annotations
→ not automatic Java behavior
```
