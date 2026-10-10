# What Generics Are and Why They Exist

This module comes **before Collection**, so you do not need to understand `List`, `Set`, or `Map` yet. Start with one question:

```text
If the same logic must work with many data types,
how can we write it once while still letting the compiler check the exact type?
```

That is the problem **generics** solve.

> **Generics are the Java mechanism that lets a class, interface, constructor, or method declare a data type as a parameter.**
>
> This lets us reuse one structure or algorithm for many data types while preserving compile-time type checking.

`<T>`, wildcards, PECS, and type erasure are mechanisms and rules built around that core idea.
