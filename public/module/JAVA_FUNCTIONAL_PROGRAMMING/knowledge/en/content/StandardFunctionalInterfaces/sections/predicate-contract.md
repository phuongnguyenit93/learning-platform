`Predicate<T>` represents a condition about a value of type `T`. Its result is always `boolean`.

```java
Predicate<String> nonEmpty = text -> !text.isEmpty();
Predicate<Integer> adult = age -> age >= 18;

boolean accepted = adult.test(20); // true
```

Its functional method is `boolean test(T value)`.

Use `Predicate` when the behavior answers a question such as "is this value valid?", "does it match?", or "should it be accepted?". Giving a predicate a meaningful variable or parameter name often makes the calling code read like a business rule.

Predicates can be combined with operations such as `and`, `or`, and `negate`; composition is discussed later so this chapter can focus first on choosing the correct contract.
