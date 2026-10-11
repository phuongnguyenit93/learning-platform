Callers usually do not need to write the method type argument explicitly:

```java
String name = echo("java");
Integer number = echo(100);
```

The compiler infers `T` from constraints such as:

- argument types;
- target type from assignment/return context;
- other constraints involved in method applicability.

An explicit type witness is available when needed:

```java
String value = Util.<String>echo("java");
```

When inference is already clear, this is usually unnecessary.

Type inference is not runtime guessing. The compiler must resolve a type satisfying the invocation constraints before bytecode is produced.
