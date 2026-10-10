Passing behavior is useful when the algorithm is stable but one decision varies. Instead of hard-coding every variation with `if` branches or subclasses, the method accepts the varying rule as a parameter.

```java
static List<String> select(
        List<String> values,
        Predicate<String> rule) {
    List<String> result = new ArrayList<>();
    for (String value : values) {
        if (rule.test(value)) {
            result.add(value);
        }
    }
    return result;
}

List<String> longNames = select(names, name -> name.length() >= 5);
```

The important design step is choosing a functional contract that expresses the role clearly. A `Predicate<T>` communicates "decide true/false" better than a generic custom interface with an unclear method name.
