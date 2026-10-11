After loading, the JVM links the class. Linking prevents raw class bytes from becoming executable runtime behavior without structural checks and runtime setup.

Linking contains three conceptual phases:

1. **Verification** checks that the class-file structure and bytecode satisfy JVM constraints. Invalid bytecode must not be allowed to corrupt JVM type or memory safety.
2. **Preparation** allocates storage for static fields and gives them their default values. Java source initializers have not run yet.
3. **Resolution** turns symbolic references in the class file into direct runtime references when the JVM needs them. A JVM may resolve references lazily rather than resolving every dependency immediately.

Consider:

```java
final class PluginRegistry {
    static int maxPlugins = loadConfiguredLimit();

    private static int loadConfiguredLimit() {
        System.out.println("computing limit");
        return 20;
    }
}
```

During **preparation**, storage for `maxPlugins` exists and initially contains the JVM default value `0`. The call to `loadConfiguredLimit()` belongs to **initialization**, so it has not executed during preparation.

Resolution is also different from source-level imports. An `import` helps the Java compiler resolve names in source code; it does not eagerly load or initialize the imported class at runtime. Runtime resolution concerns symbolic references stored in class files, such as references to another class, field, or method.

### Which loader is used when class A needs class B?

This is the bridge from lifecycle to parent delegation. Under JVM class/interface resolution, when class `A` has a symbolic reference to class/interface `B`, **the defining ClassLoader of `A` is used to load `B`**. That loader may define `B` itself or delegate to a parent; the loader that ultimately defines `B` becomes `B`'s defining loader.

For the running plugin example:

```text
HelloPlugin
→ defined by PluginClassLoader
→ bytecode references demo.api.Plugin
→ JVM needs to resolve Plugin
→ loading starts through PluginClassLoader
→ PluginClassLoader applies parent delegation
→ parent Application ClassLoader already owns Plugin API
→ same shared Plugin.class is returned
```

The useful mental model is not to memorize VM internals, but to understand that the referring class's defining loader is the natural starting point for dependency loading. TCCL later exists because parent-owned framework code sometimes needs a different discovery context to see child/application providers.

This separation allows the JVM to check and prepare a type before executing its static initialization logic. It also explains why failures may appear at different moments: malformed bytecode can fail during verification, a missing referenced type can surface during resolution, and user code can fail later during initialization.

### Failure model: map the error to the lifecycle stage

Class-loading failures are easier to reason about when they are tied back to the runtime question being answered:

| Symptom | Mental model |
| --- | --- |
| `ClassNotFoundException` | Code explicitly asked a `ClassLoader`/`Class.forName` operation for a binary name and the requested class could not be found. Dynamic-loading APIs often expose this as a checked exception. |
| `NoClassDefFoundError` | The JVM needs a class definition during normal execution/linking but that definition cannot be made available or completed. It can also be seen on later active use after class initialization previously failed. |
| `VerifyError` | Bytes were loaded, but bytecode/class-file verification detected a JVM constraint violation. |
| `ClassFormatError` | Bytes were found, but they are not a valid JVM class-file representation. |
| `UnsupportedClassVersionError` | The class file targets a newer class-file version than the current JVM supports. |
| `LinkageError` | A family of errors indicating that definition/linking cannot produce a consistent runtime type graph; examples include `NoClassDefFoundError`, `ClassFormatError`, `NoSuchMethodError`, and `IncompatibleClassChangeError`. |

A useful debugging flow is:

```text
explicit dynamic lookup cannot find the requested name?
→ ClassNotFoundException

runtime dependency cannot be made available/linked?
→ NoClassDefFoundError or another LinkageError

bytes were found but the format/version is invalid?
→ ClassFormatError / UnsupportedClassVersionError

static initialization failed earlier?
→ first active use often ExceptionInInitializerError
→ later active use may be NoClassDefFoundError: Could not initialize class
```

The names matter less than the diagnostic questions: **were the bytes found, could the JVM define/link them, and did initialization succeed?**
