Distinguish two kinds of failure:

```text
no acceptable bundle can be resolved
→ ResourceBundle.getBundle(...) can throw MissingResourceException

a bundle resolves but a requested key is absent from its lookup chain
→ getString(key) can throw MissingResourceException
```

Code can handle the exception according to product policy:

```java
try {
    String message = bundle.getString("order.created");
} catch (MissingResourceException ex) {
    // log, translate, or fail according to an explicit application policy
}
```

However, production UI should not be the first place missing translations are discovered. Build/test validation can compare keys across resource sets:

```text
base keys
        ↓ compare
locale-specific keys
        ↓
report missing or unexpected entries
```

Silently catching every missing resource and showing the key itself may keep the page alive, but it can also hide deployment/content defects indefinitely. If that fallback is used, it should be observable through logging or monitoring.

Fallback is a reuse and resilience mechanism, not a substitute for translation quality.

The final chapter collects common production mistakes where locale-sensitive behavior leaks into identifiers, serialization, or global environment assumptions.
