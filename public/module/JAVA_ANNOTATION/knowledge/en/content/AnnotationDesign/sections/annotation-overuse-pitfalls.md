### 1. Hidden control flow

Code such as:

```java
@Transactional
@Audited
@Secured
void transfer() {
}
```

may trigger substantial behavior outside the method body. That is not inherently wrong, but developers must be able to identify which consumer owns each annotation and what ordering or conditions apply.

If important behavior cannot be traced back to a clear contract or documentation, annotations are making the code harder to reason about.

### 2. Framework coupling

Framework-owned annotations can reduce visible boilerplate while still creating strong coupling to framework semantics.

Keep this distinction clear:

```text
Java annotation mechanism
≠
framework behavior triggered by an annotation
```

### 3. Incorrect `@Retention`

```text
runtime consumer
+ SOURCE retention
→ metadata disappears before the consumer can read it
```

The opposite mistake is making everything `RUNTIME` because it appears “safer”. That broadens the contract unnecessarily and can imply that runtime inspection is part of the design when it is not.

### 4. Overly broad `@Target`

If an annotation only makes sense on methods but also allows `FIELD`, `TYPE`, and `PARAMETER`, the compiler can no longer prevent meaningless placements.

### 5. Turning annotations into a large configuration language

An annotation with dozens of elements, sentinel values, interacting flags, and override rules can be harder to understand than a typed configuration object.

```java
@Feature(
        mode = Mode.AUTO,
        fallback = true,
        cache = true,
        retries = 3,
        async = true,
        strict = false
)
```

When metadata starts encoding a complex algorithm or many interacting flags, a real type, builder, or configuration object can make behavior clearer and easier to test.

### 6. Default values evolve the contract

Default values belong to the annotation type. When a consumer reads an annotation use that omitted an element, changing the annotation type's default can change the observed value. Defaults are therefore part of the compatibility contract, not merely syntax sugar.
