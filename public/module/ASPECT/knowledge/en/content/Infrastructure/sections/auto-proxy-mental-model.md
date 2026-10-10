Simplified mental model:

```text
Bean definition
    ↓
bean instance is created
    ↓
BeanPostProcessor infrastructure
    ↓
Spring finds matching Advisors
    ↓
if needed
→ return an AOP proxy instead of the raw bean reference
```

An important infrastructure family is:

```text
AbstractAutoProxyCreator
```

With `@AspectJ` support, the runtime typically has a concrete auto-proxy creator responsible for turning Aspect metadata into Advisor candidates and deciding which beans require proxies.

Do not hard-code a specific auto-proxy creator class name into business logic because it is framework infrastructure.
