Custom loading is powerful, but it does not mean application code may redefine every name. In particular, `ClassLoader.defineClass` rejects attempts by ordinary loaders to define classes whose names begin with `java.`.

This prevents code such as a custom loader trying to define:

```text
java.lang.String
java.util.List
java.time.Instant
```

as application-owned replacements for core Java classes.

The boundary matters for both correctness and security. Many JVM and library assumptions depend on platform types having well-known ownership and semantics. Allowing arbitrary child loaders to impersonate those classes would break far more than ordinary dependency isolation.

Application packages do not receive that same blanket protection merely because they are important. If `demo.api.Plugin` must remain shared, the loader architecture must enforce that through parent delegation or an equivalent explicit rule.

This leads directly to custom loader design: the next chapter shows where custom bytes enter the process, why `findClass` is the usual extension point, and what responsibilities come with calling `defineClass`.
