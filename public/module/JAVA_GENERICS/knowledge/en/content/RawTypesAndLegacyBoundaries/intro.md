# Raw Types and Legacy Boundaries

You may encounter both forms:

```java
List<String> names = new ArrayList<>();
List names = new ArrayList();
```

The second line looks like “generics with the `<String>` part removed.” Why does Java still allow it?

Because **generics were added after a large ecosystem of Java code already existed**. New generic code needed a way to keep interoperating with older libraries and source that had no type arguments.

`List`, `Box`, `Map`, and other generic type names used **without a type argument** are called **raw types**.

A raw type is a **legacy compatibility bridge**. The trade-off is weaker compile-time type protection. The goal of this chapter is therefore not to teach raw types as a normal style, but to **recognize them, understand their risks, and contain them at legacy boundaries**.
