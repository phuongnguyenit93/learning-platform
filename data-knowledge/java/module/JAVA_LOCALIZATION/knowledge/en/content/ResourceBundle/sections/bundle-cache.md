`ResourceBundle.getBundle(...)` caches loaded bundles so each lookup does not repeatedly reload resources.

That has two sides:

```text
performance
→ repeated requests can reuse bundle instances

runtime updates
→ changing a resource file does not imply an already-running JVM immediately sees it
```

The cache can be cleared when a design truly requires it:

```java
ResourceBundle.clearCache();
ResourceBundle.clearCache(classLoader);
```

`ResourceBundle.Control` can customize TTL, reload, and candidate behavior, but that is an advanced mechanism. Decide first whether the application actually needs live resource reloading or can treat bundles as deployment-time content.

The distinction between **missing bundles** and **missing keys**, together with `MissingResourceException` policy, is owned by the final fallback milestone so it can be learned with the complete `ResourceBundle` failure/fallback model.

The next chapter handles the next problem: localized messages often include dynamic values. Concatenating fragments assumes one sentence structure, while `MessageFormat` lets the translated pattern own argument placement.
