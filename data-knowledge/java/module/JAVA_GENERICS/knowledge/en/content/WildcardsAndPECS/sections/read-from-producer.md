`List<? extends Animal>` may actually be:

```java
List<Animal>
List<Dog>
List<Cat>
```

The method can safely read:

```java
Animal animal = source.get(0);
```

Every possible list produces at least an `Animal`.

But it cannot safely write a `Dog`:

```java
// source.add(new Dog()); // compile error
```

The list might really be a `List<Cat>`.

“extends means read-only” is only a shorthand. Operations independent of element type, such as `clear()`, can still be legal. The important restriction is writing a **specific element value** when the exact captured type is unknown.
