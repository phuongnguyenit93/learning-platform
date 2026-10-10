Imagine `List<Dog>` could be assigned to `List<Animal>`:

```java
List<Dog> dogs = new ArrayList<>();
List<Animal> animals = dogs; // imagine this were legal
animals.add(new Animal());

Dog dog = dogs.get(0); // original guarantee is broken
```

The problem exists because `List` both **produces** and **consumes** elements. Global covariance would make mutation unsafe.

Mutable `List` makes the safety motivation especially obvious, but Java's rule is broader: generic classes and interfaces are invariant by default even when one particular API happens to be read-only. Java does not infer variance separately from each declaration's methods; when use-site flexibility is needed, wildcards express it explicitly.

So invariance is not an arbitrary restriction. It prevents Java from inventing subtype relationships between parameterized types merely because their type arguments are related.

Next, use this exact problem to ask: **how can an API accept a related family of generic types without weakening type safety?** That is the role of wildcards.
