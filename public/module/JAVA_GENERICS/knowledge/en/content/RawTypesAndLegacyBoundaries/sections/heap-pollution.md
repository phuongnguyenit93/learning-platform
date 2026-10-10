This section **goes deeper into why unchecked type-safety failures happen**. A beginner should first be able to recognize raw types and understand unchecked warnings; heap-pollution details become more important around legacy APIs, generic varargs, and failures that surface far from their source.

Heap pollution occurs when a variable of a parameterized type refers to an object that does not satisfy the parameterized type's expected element relationship.

A raw type can create it:

```java
List<String> names = new ArrayList<>();
List raw = names;
raw.add(123); // unchecked

String name = names.get(0); // ClassCastException at an inserted cast
```

The failure may appear **far away from the pollution point**.

Heap pollution can also arise around generic varargs or unchecked casts. The `language-basics → Varargs` module owns full varargs semantics, while the related annotation belongs to the Annotation module. The deeper reason involves how much generic type information remains available at runtime; the Type Erasure chapter introduces that model. For now, keep the practical rule: an unchecked operation can create a state the compiler can no longer fully prove type-safe.
