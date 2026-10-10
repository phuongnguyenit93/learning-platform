Returned behavior becomes especially useful when it remembers values from the method call that created it. The lambda captures those values and can use them later.

```java
static Function<String, String> prefixWith(String prefix) {
    return value -> prefix + value;
}

Function<String, String> errorLabel = prefixWith("ERROR: ");
System.out.println(errorLabel.apply("Disk full"));
```

Each invocation of `prefixWith` creates behavior associated with that invocation's `prefix`. The captured local variable must obey the `final`/effectively-final rule discussed earlier.

Capturing a reference does not freeze the referenced object. If the returned behavior observes mutable state, later mutations can change its result and make the behavior harder to reason about.
