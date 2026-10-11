Once behavior has a type, a method can receive that behavior as a parameter:

```java
List<String> select(
        List<String> names,
        Predicate<String> rule) {

    List<String> result = new ArrayList<>();
    for (String name : names) {
        if (rule.test(name)) {
            result.add(name);
        }
    }
    return result;
}
```

Callers can now choose the variation without changing `select`:

```java
select(names, name -> name.length() >= 5);
select(names, name -> name.startsWith("A"));
```

This pattern is often called **behavior parameterization**: the stable algorithm stays in one place while a changing policy or action is supplied from outside.

The same idea appears throughout Java APIs in callbacks, comparators, event handlers, validation rules, deferred work, and many other contracts. Later chapters explain the type rules that make these values safe.
