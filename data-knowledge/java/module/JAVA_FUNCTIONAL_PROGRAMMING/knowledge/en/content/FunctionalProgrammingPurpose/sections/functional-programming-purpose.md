In Java, functional programming means writing some parts of a program by **describing behavior that can be passed around, selected, combined, and executed later**. Java does not turn functions into a separate top-level type. Instead, a behavior value is represented through a **functional interface**, and lambdas or method references provide an implementation for that interface's single functional contract.

The key shift is from only passing data to also passing **what should be done with the data**. A method can therefore receive behavior as an input just as it receives a `String`, `List`, or domain object.

```java
boolean isAdult(int age) {
    return age >= 18;
}

Predicate<Integer> rule = age -> age >= 18;
```

The first form defines behavior as a normal method. The second form packages equivalent behavior behind the `Predicate<Integer>` contract so another API can receive it as a value.

Java remains a multi-paradigm language. Functional style is one tool alongside object-oriented and imperative code; it is especially useful when the variation in a task is the **behavior itself**.
