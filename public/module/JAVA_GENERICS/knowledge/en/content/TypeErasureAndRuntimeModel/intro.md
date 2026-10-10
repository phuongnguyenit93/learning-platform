# Type Erasure and Runtime Metadata

By this point the compiler seems to know a lot:

```java
List<String> texts = new ArrayList<>();
List<Integer> numbers = new ArrayList<>();
```

But ask the runtime:

```java
System.out.println(texts.getClass() == numbers.getClass()); // true
```

If `String` and `Integer` matter to generics, **why does runtime see the same `ArrayList` class?**

The key is that Java generics are checked primarily at **compile time**. The compiler uses type arguments to validate source code and then translates generic declarations/calls into bytecode compatible with the older JVM class model.

That translation mechanism is called **type erasure**.

Understanding erasure connects several otherwise surprising facts:

- `List<String>` and `List<Integer>` share the same runtime class;
- an arbitrary broad reference such as `Object` cannot simply be tested as `List<String>`;
- the compiler may insert casts;
- bridge methods can appear;
- several restrictions in the next chapter exist.
