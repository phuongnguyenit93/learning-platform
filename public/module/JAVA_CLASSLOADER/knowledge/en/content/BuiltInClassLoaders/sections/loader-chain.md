The ordinary parent relationship can be pictured as:

```text
Application/System ClassLoader
            ↓ parent
Platform ClassLoader
            ↓ parent
Bootstrap loading mechanism
            ↓ represented by
           null
```

You can inspect the object-visible part of that chain:

```java
static void printChain(ClassLoader loader) {
    for (ClassLoader current = loader;
         current != null;
         current = current.getParent()) {
        System.out.println(current);
    }
    System.out.println("<bootstrap>");
}

printChain(ClassLoader.getSystemClassLoader());
```

And you can compare ownership of representative classes:

```java
System.out.println("project  : " + BuiltInClassLoaders.class.getClassLoader());
System.out.println("platform : " + java.sql.Driver.class.getClassLoader());
System.out.println("bootstrap: " + String.class.getClassLoader());
```

Exact ownership of individual JDK classes can vary with the modular runtime, so the useful mental model is the **responsibility boundary**, not memorizing one example class for each loader.

The parent chain is also not the same thing as Java inheritance. A child ClassLoader does not inherit classes as Java subclasses inherit members. Instead, the chain provides a lookup relationship. The default lookup strategy asks the parent first, which is the subject of the next chapter.
