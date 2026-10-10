`RetentionPolicy.CLASS` records the annotation in the class file but does not require the JVM to expose it through runtime reflection.

```java
@Retention(RetentionPolicy.CLASS)
public @interface BytecodeHint {
}
```

CLASS is also the default when an annotation type declares no `@Retention` meta-annotation.

This lifetime is useful when bytecode tools or build-time post-processors need the metadata after Java compilation but the application itself does not need reflective access.

```text
compiler output
→ annotation attribute remains in .class data

ordinary runtime reflection
→ do not design around retrieving it
```

The presence of metadata in a class file and reflective visibility are therefore different contracts.
