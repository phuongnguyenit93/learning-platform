`Predicate<T>` provides `and`, `or`, and `negate` so small conditions can form larger rules.

```java
Predicate<String> notBlank = text -> text != null && !text.isBlank();
Predicate<String> shortEnough = text -> text.length() <= 20;

Predicate<String> validName = notBlank.and(shortEnough);
```

`and` and `or` short-circuit: the second predicate is evaluated only when the first result does not already determine the answer. That matters if a later predicate assumes an earlier guard has passed.

Predicates should ideally behave like questions. Hidden mutation or I/O inside a predicate makes a condition unexpectedly expensive or stateful.
