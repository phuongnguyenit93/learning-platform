These are illegal:

```java
// List<int> numbers;
// Box<double> value;
```

Type arguments must be reference types:

```java
List<Integer> numbers = new ArrayList<>();
Box<Double> value = new Box<>();
```

Autoboxing makes use convenient:

```java
numbers.add(1); // int -> Integer
```

But the wrapper is still an object, with different allocation/identity/nullability behavior and potential costs compared with a primitive. `List<Integer>` is not a primitive-specialized `int[]`.
