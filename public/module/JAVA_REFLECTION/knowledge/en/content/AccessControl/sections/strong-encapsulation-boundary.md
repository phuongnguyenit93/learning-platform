The Java Platform Module System adds a boundary above package access. For named modules, two terms matter:

- `exports` allows other modules to use a package's **public API**;
- `opens` allows other modules to perform **deep reflection** on non-public members in that package.

For example:

```java
module payment.core {
    exports com.example.payment.api;
    opens com.example.payment.internal to payment.framework;
}
```

`payment.framework` may reflect deeply into `com.example.payment.internal`, while unrelated modules do not automatically receive that privilege. If a package is exported but not opened, its public API can be used according to export rules, but code in another module cannot simply force access to private, package-private, protected instance members, or protected constructors with `setAccessible(true)`.

That is the role of strong encapsulation: a module can distinguish public API from packages intentionally opened for deep reflection. Reflection remains powerful, but it is not a universal bypass for module boundaries.

At launch time, a JVM option can temporarily open a package to a specific consumer module:

```text
--add-opens payment.core/com.example.payment.internal=payment.framework
```

That is a runtime/deployment choice, not a reason for a library to casually depend on private internals. If a framework needs long-term reflective access, the module descriptor or integration contract should express that boundary deliberately.
