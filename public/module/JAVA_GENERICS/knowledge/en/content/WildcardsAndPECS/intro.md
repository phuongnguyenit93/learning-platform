# Wildcards, PECS, and Data Direction

The previous chapter explained why `List<Dog>` is not automatically a `List<Animal>`. That rule protects type safety, but real APIs still need a way to accept **a related family of generic types** without weakening invariance.

We also know that `List<String>` and `List<Integer>` are different parameterized types. A new requirement appears:

```text
"This method does not care what exact element type the List has.
It only needs an operation that works for every List."
```

For example, a method that only needs the size:

```java
static int sizeOf(List<?> values) {
    return values.size();
}
```

There is no need to name the element type `T` because the method does not relate that type to another parameter or return value.

The **wildcard `?`** means: “there is a concrete type argument here, but this code does not need to know exactly which one.”

Wildcards make **API boundaries more flexible** while preserving generic type safety. `? extends ...` and `? super ...` further constrain where that unknown type sits in a type hierarchy.

Directly connecting this to invariance:

```java
List<Dog> dogs = new ArrayList<>();

List<? extends Animal> animals = dogs;
List<? super Dog> target = new ArrayList<Animal>();
```

Wildcards provide controlled **use-site variance** instead of making the generic type globally covariant.

The previous Invariance chapter already introduced the minimal `List<E>` model (`get` for reading, `add` for writing, and `size` for element count). This chapter reuses only that model and assumes no additional Collection knowledge.
