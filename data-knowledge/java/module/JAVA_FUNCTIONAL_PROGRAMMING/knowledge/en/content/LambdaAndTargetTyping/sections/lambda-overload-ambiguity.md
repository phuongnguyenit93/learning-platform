Overloaded methods can create ambiguity when the same lambda shape is compatible with more than one functional-interface parameter.

```java
void use(Callable<String> task) { }
void use(Supplier<String> task) { }

// use(() -> "done"); // ambiguous
```

Both target types accept a no-argument behavior returning `String`, so the lambda text alone does not select one overload.

An explicit target can disambiguate the call:

```java
use((Supplier<String>) () -> "done");
```

or the behavior can first be assigned to a named variable with the intended type.

Avoid overload sets that differ only by unrelated functional-interface types with the same lambda shape when you control the API design. They make otherwise simple lambda calls harder for both the compiler and the reader to interpret.
