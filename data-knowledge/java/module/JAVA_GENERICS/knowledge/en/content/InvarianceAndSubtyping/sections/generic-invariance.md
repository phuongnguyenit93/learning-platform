The same rule demonstrated with `Box<T>` applies to `List<T>`:

```java
class Animal {}
class Dog extends Animal {}

List<Dog> dogs = new ArrayList<>();
// List<Animal> animals = dogs; // compile error
```

Even though `Dog <: Animal`, Java does not infer:

```text
List<Dog> <: List<Animal>
```

This is **the same invariance rule**, now shown with `List` because the next chapter uses it to introduce wildcards and PECS.
