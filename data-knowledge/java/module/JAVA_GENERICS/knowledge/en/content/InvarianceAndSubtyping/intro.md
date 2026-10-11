# Generic Invariance and Subtyping

This is one of the most surprising parts of generics at first. We already know:

```java
Dog dog = new Dog();
Animal animal = dog; // perfectly legal
```

`Dog` is a subtype of `Animal`. The new question is: **does that relationship automatically transfer through a generic type?**

Java therefore makes generic types **invariant by default**:

```text
Dog is a subtype of Animal
does not imply
Box<Dog> is a subtype of Box<Animal>
```

The next chapter introduces wildcards as the mechanism for selectively restoring the flexibility an API needs without breaking that guarantee.
