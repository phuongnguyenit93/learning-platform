**Verification** checks that a prospective class representation satisfies structural and type-safety constraints required for safe execution.

**Preparation** creates static-field storage and gives it default JVM values before Java-level initializers run.

**Resolution** turns symbolic references into more direct runtime references to the corresponding class, interface, field, or method.

For example:

```java
static int port = 8080;
```

conceptually separates into:

```text
preparation    → storage exists, initial default value = 0
initialization → initializer executes, value becomes 8080
```

For a `static final` constant variable carrying a `ConstantValue` attribute, the constant value is also assigned by the **initialization procedure**, before `<clinit>` runs; it is still not part of preparation. A durable rule is: preparation creates static storage and installs default JVM values, while Java-level/static constant values belong to initialization semantics.

Separating preparation from initialization explains many static-state behaviors hidden by the source-level view.
