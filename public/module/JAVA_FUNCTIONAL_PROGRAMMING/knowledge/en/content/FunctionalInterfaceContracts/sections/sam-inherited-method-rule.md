Inheritance can produce several abstract declarations that still represent one logical operation. If the inherited methods are compatible under Java's override rules, the interface may still have a single functional contract.

```java
interface Left {
    CharSequence value();
}

interface Right {
    String value();
}

@FunctionalInterface
interface Combined extends Left, Right {
}
```

`String` is a covariant return type for `CharSequence`, so the inherited `value()` declarations can describe one compatible contract. A lambda targeting `Combined` therefore provides one `value` behavior.

By contrast, unrelated abstract methods such as `read()` and `write()` do not collapse into one contract. Neither do inherited declarations whose signatures or return types cannot form a valid overriding relationship.

This is why "count the abstract methods in the source" is only a shortcut, not the actual rule.
