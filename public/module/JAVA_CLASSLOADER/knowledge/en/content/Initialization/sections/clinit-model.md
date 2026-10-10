At source level, Java lets a class declare static field initializers and static initializer blocks:

```java
final class PluginEnvironment {
    static String mode = loadMode();

    static {
        System.out.println("mode = " + mode);
    }

    private static String loadMode() {
        return System.getProperty("plugin.mode", "safe");
    }
}
```

The JVM class-file model represents class or interface initialization through a special method named `<clinit>` when one is needed. You do not declare or invoke `<clinit>` directly in Java source; the compiler derives it from static initialization work.

Within one class, static field initializers and static blocks execute in their source order:

```java
final class OrderTrace {
    static int first = trace("first", 1);

    static {
        trace("block", 2);
    }

    static int second = trace("second", 3);

    private static int trace(String name, int value) {
        System.out.println(name);
        return value;
    }
}
```

When initialization occurs, the observable order is `first`, `block`, `second`.

This is conceptually later than preparation. During preparation, static storage already exists with JVM default values. During initialization, source-level initialization expressions assign their intended values and execute static blocks.
