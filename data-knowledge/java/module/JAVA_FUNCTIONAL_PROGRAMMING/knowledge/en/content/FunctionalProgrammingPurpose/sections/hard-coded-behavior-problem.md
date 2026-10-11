Suppose a method contains every business rule directly inside its control flow:

```java
List<String> selectNames(List<String> names, String mode) {
    List<String> result = new ArrayList<>();

    for (String name : names) {
        if (mode.equals("LONG") && name.length() >= 5) {
            result.add(name);
        } else if (mode.equals("STARTS_WITH_A") && name.startsWith("A")) {
            result.add(name);
        }
    }

    return result;
}
```

The traversal and the selection rule are mixed together. Every new rule requires modifying the method, adding another branch, and retesting behavior that was otherwise unchanged.

The functional-programming mechanism addresses this kind of variation by separating two responsibilities:

- the method owns **when and where** a rule is applied;
- the caller supplies **which rule** should run.

This does not mean every `if` statement should become a lambda. Behavior parameterization is valuable when a meaningful operation is expected to vary or be reused.
