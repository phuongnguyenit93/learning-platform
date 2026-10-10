Initialization failure is not treated like an ordinary method call that can simply be retried on the next access.

Consider:

```java
final class BrokenPluginConfig {
    static final String TOKEN = loadToken();

    private static String loadToken() {
        throw new IllegalStateException("missing plugin token");
    }
}
```

On the first active use, the runtime exception escapes the class initialization logic. Because the thrown value is not already an `Error`, the JVM reports the initialization failure as an `ExceptionInInitializerError`:

```java
try {
    System.out.println(BrokenPluginConfig.TOKEN);
} catch (ExceptionInInitializerError error) {
    System.out.println(error.getCause());
}
```

The class is then considered **erroneous** for that defining loader. A later active use does not rerun `loadToken()` as a retry mechanism. It fails again, commonly with `NoClassDefFoundError` indicating that the class could not be initialized.

```text
first active use
  → initialization code throws
  → ExceptionInInitializerError for a non-Error cause
  → class identity becomes erroneous

later active use of same class identity
  → no retry of <clinit>
  → NoClassDefFoundError / initialization failure state
```

If initialization itself throws an `Error`, the JVM does not need to wrap that first failure in `ExceptionInInitializerError`; the exact first throwable therefore depends on what escaped the initializer.

In an isolated plugin architecture, unloading the failed loader and creating a **new loader that defines a new class identity** can produce a fresh initialization lifecycle. The old erroneous class itself does not become healthy again.

This behavior is why important recoverable configuration should usually be validated explicitly rather than hidden inside static initialization.

That runtime identity also owns the initialization state just discussed. The final chapter follows that identity to its lifecycle boundary: when a plugin is stopped, when can the defining ClassLoader and the classes it owns actually become reclaimable, and which longer-lived references can prevent that from happening?
