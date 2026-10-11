> **Beginner boundary:** here you only need the model that `@SafeVarargs` is a programmer assertion about generic-varargs safety. Type erasure, reifiable types, and heap-pollution mechanics belong to the Generics module.

Generic varargs can create a heap-pollution boundary because varargs are implemented with arrays while generic type arguments are erased.

```java
@SafeVarargs
static <T> List<T> combine(List<T>... parts) {
    return Arrays.stream(parts)
            .flatMap(List::stream)
            .toList();
}
```

`@SafeVarargs` tells callers and the compiler that the method body does not perform potentially unsafe operations on the varargs parameter. This is a **promise by the author**, not a runtime check.

`@SafeVarargs` is only legal on **variable-arity** constructors or on variable-arity methods whose implementation cannot later be replaced by overriding: `static`, `final`, or `private` instance methods.

A misuse can still be unsafe:

```java
@SafeVarargs
static void unsafe(List<String>... lists) {
    Object[] array = lists;
    array[0] = List.of(42); // heap pollution
}
```

The annotation must therefore follow an actual review of the implementation. Detailed heap-pollution and generic-varargs mechanics belong to the generics boundary.

### How is this different from `@SuppressWarnings("unchecked")`?

The warning scope is materially different:

```text
@SuppressWarnings("unchecked")
→ local suppression for warnings belonging to the annotated declaration

@SafeVarargs
→ suppresses the non-reifiable varargs warning on the declaration
→ also suppresses the corresponding unchecked warning at invocation sites
```

That non-local effect is why `@SafeVarargs` is an API-level programmer assertion rather than merely a local warning switch.
