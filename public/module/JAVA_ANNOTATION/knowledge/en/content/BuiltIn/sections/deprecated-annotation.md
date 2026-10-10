`@Deprecated` marks a program element as discouraged for continued use. Compilers can emit deprecation warnings when client code uses it.

```java
@Deprecated(since = "2.0", forRemoval = true)
public void legacyPay() {
}
```

Since Java 9, the annotation can record two useful pieces of metadata:

```text
since
→ version in which the API was deprecated

forRemoval
→ whether removal is intended in a future release
```

The annotation and the Javadoc `@deprecated` tag serve related but different purposes:

```text
@Deprecated
→ machine-readable/compiler-visible deprecation signal

@deprecated Javadoc tag
→ human explanation, replacement path, migration advice
```

A useful public API normally provides both when documentation is available. Deprecation should help callers migrate rather than merely label an API as old.
