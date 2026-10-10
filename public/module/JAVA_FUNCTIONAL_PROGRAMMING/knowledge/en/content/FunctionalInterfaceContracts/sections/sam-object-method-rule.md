An interface may explicitly redeclare a method whose signature matches a **public instance method of `Object`**, such as `equals(Object)`. Such a declaration does not create an additional functional-interface abstract operation.

```java
@FunctionalInterface
interface Matcher {
    boolean matches(String value);

    @Override
    boolean equals(Object other);
}
```

`Matcher` can still be functional because `equals(Object)` corresponds to a public `Object` method, leaving `matches` as the functional contract.

This rule should not be generalized to every method name found in `Object`. The exclusion is based on the relevant public instance-method signature rules, not simply on spelling a familiar name such as `clone` or `finalize`.
