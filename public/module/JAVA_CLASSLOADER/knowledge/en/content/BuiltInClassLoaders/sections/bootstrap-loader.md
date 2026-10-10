The JVM must be able to load fundamental runtime classes before ordinary Java application code is available. That bootstrap problem is handled by the **bootstrap class loader**, the root loading mechanism provided by the JVM implementation.

It loads core platform classes, including fundamental classes from modules such as `java.base`. Unlike ordinary application loaders, it is not exposed as a normal `ClassLoader` object through `Class.getClassLoader()`.

That is why this prints `null`:

```java
System.out.println(String.class.getClassLoader());
System.out.println(Object.class.getClassLoader());
```

`null` here does **not** mean "nobody loaded this class." In the `Class` API it represents that the class was defined by the bootstrap loading mechanism.

This special representation matters when inspecting loader chains. Code such as this must treat `null` as the bootstrap boundary instead of dereferencing it:

```java
ClassLoader loader = String.class.getClassLoader();

if (loader == null) {
    System.out.println("bootstrap-defined class");
}
```

For the plugin running example, shared application interfaces should never attempt to redefine core JDK types. The bootstrap loader sits above every ordinary loader boundary and establishes one consistent runtime identity for those foundational classes.
