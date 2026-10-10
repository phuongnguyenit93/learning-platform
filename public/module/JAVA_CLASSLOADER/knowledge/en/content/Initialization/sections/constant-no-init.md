One active-use rule has an important exception: reading a `static final` **constant variable** can be compiled as the constant value itself and therefore may not initialize the declaring class.

Before the constant case, keep two other important **non-triggers** in mind:

```java
Class<?> type = PluginConstants.class;
```

Obtaining the class literal does **not by itself initialize** `PluginConstants`.

Also, if source code writes `SubType.SOME_STATIC_FIELD` but that field is actually declared by `SuperType`, then for a static-field access that **really triggers initialization**—for example, reading a non-constant static field—the initialized type is the **class/interface that declares the field**. Merely naming a subclass on the left side does not initialize that subclass. If the field is a compile-time constant, the exception below still applies: the read may initialize neither `SuperType` nor `SubType`.

```java
final class PluginConstants {
    static {
        System.out.println("PluginConstants initialized");
    }

    static final int API_VERSION = 3;
    static final String NAME = "hello";

    static final Integer BOXED_VERSION = 3;
    static final int RUNTIME_VERSION = Integer.parseInt("3");
}
```

These reads can behave differently:

```java
System.out.println(PluginConstants.API_VERSION);     // may be inlined; no init required
System.out.println(PluginConstants.NAME);            // may be inlined; no init required

System.out.println(PluginConstants.BOXED_VERSION);   // initializes class
System.out.println(PluginConstants.RUNTIME_VERSION); // initializes class
```

A Java constant variable must satisfy specific language rules: roughly, it is a `final` primitive or `String` initialized with a compile-time constant expression. `Integer` is a reference type outside that constant-variable rule, and `Integer.parseInt("3")` is a runtime call.

Inlining also has a binary-compatibility consequence. If a library changes a public compile-time constant from `3` to `4`, already-compiled client bytecode may still contain `3` until the client is recompiled.

This section reinforces the lifecycle distinction from chapter 1: mentioning or even reading something through a class name does not automatically prove that initialization occurred. Observe the exact operation and the exact runtime class identity.
