`List<? super Dog>` may be:

```java
List<Dog>
List<Animal>
List<Object>
```

Writing a `Dog` is safe:

```java
target.add(new Dog());
```

When reading, only this is guaranteed:

```java
Object value = target.get(0);
```

The actual list may contain other values when its true element type is `Animal` or `Object`.
