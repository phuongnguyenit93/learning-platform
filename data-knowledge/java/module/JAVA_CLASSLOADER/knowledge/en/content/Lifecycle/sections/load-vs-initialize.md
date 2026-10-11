The difference can be observed directly with `Class.forName`:

```java
final class TracedPlugin {
    static {
        System.out.println("TracedPlugin initialized");
    }
}

public class LoadingDemo {
    public static void main(String[] args) throws Exception {
        ClassLoader loader = LoadingDemo.class.getClassLoader();

        Class<?> type = Class.forName(
                "demo.TracedPlugin",
                false,
                loader
        );

        System.out.println("loaded: " + type.getName());

        Class.forName(
                "demo.TracedPlugin",
                true,
                loader
        );
    }
}
```

The first call requests the class without initialization. Obtaining the `Class<?>` therefore does not, by itself, prove that the static block has run. The second call explicitly requests initialization, so the initialization message appears at that point if the class has not already been initialized.

This matters in frameworks and tools. A scanner may need class metadata without wanting to trigger database connections, native library loading, registry mutation, or other static side effects. A plugin manager may want to inspect or stage classes before activating them. Treating "loaded" and "initialized" as the same state would make those operations much harder to control.

It also matters while debugging. Seeing a class in a stack trace, heap view, or `Class<?>` variable does not tell you that its initialization completed successfully. Loading, linking, and initialization are separate lifecycle concepts, and later chapters build on that separation.

The lifecycle foundation is now complete: class bytes must be loaded and linked before initialization can matter. The next chapter identifies the built-in ClassLoaders that participate in normal JVM loading.
