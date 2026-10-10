`RetentionPolicy.SOURCE` means the annotation is discarded by the compiler rather than recorded in the generated class file.

```java
@Retention(RetentionPolicy.SOURCE)
public @interface GeneratedCheck {
}
```

SOURCE retention fits metadata whose consumer operates while source is being compiled, for example certain compiler checks or annotation processors.

`@Override` and `@SuppressWarnings` are familiar JDK examples with SOURCE retention. Their purpose is fulfilled during compilation; runtime code does not need to discover them reflectively.

### RELATION — SOURCE does not mean “processors cannot see it”

Annotation processing happens during compilation, before SOURCE-retained metadata is discarded from the output class file.

```text
source annotation
→ compiler/processor can observe it during compilation
→ annotation omitted from class file
→ runtime reflection cannot retrieve it later
```

This distinction becomes important in the Annotation Processing chapter.
