Suppose:

```java
class Animal {}
class Dog extends Animal {}
```

`Dog` is a subtype of `Animal`, but:

```java
Box<Dog> dogs = new Box<>();
// Box<Animal> animals = dogs; // compile error
```

`Box<Dog>` is **not** automatically a subtype of `Box<Animal>`.

The intuition is mutation safety:

```java
Box<Animal> animals = dogs; // imagine this were legal
animals.set(new Animal());  // legal for Box<Animal>
```

The original `Box<Dog>` could now contain an `Animal` that is not a `Dog`.

This is **invariance**. The next Wildcards chapter introduces controlled flexibility without losing type safety.
