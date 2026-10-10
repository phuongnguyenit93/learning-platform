Initialization is delayed until the JVM sees an **active use** that requires the class or interface to be initialized. The purpose of the delay is practical: loading metadata does not always mean the program needs to execute that type's static setup immediately.

Common initialization triggers include:

- creating an instance of a class with `new`;
- invoking a `static` method declared by the class or interface;
- reading a `static` field declared by the class or interface when that field is not a compile-time constant;
- assigning a `static` field declared by the class or interface;
- reflective operations that explicitly request initialization, such as `Class.forName("...")` with initialization enabled.

Before a class is initialized, its superclass is initialized first and the JVM also initializes the required superinterfaces that declare default methods according to the initialization rules. This does not mean every superinterface is initialized. Initializing an interface also does not automatically initialize all of its superinterfaces merely because they are inherited.

For example:

```java
final class PluginBootstrap {
    static {
        System.out.println("PluginBootstrap initialized");
    }

    static void start() {
        System.out.println("plugin system started");
    }
}

public class Demo {
    public static void main(String[] args) {
        PluginBootstrap.start();
    }
}
```

The first invocation of `PluginBootstrap.start()` requires `PluginBootstrap` to be initialized before the method executes. The static block therefore runs first.

Later sections in this chapter go deeper into `<clinit>`, synchronization, failure state, and compile-time constants. The key relationship is that **loading makes a class available to the runtime; active use is what normally forces initialization**.
