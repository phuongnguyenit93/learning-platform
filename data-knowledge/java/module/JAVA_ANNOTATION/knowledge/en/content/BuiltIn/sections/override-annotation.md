`@Override` asks the compiler to verify that a method really overrides a compatible method from a supertype, or otherwise satisfies the language rule that permits `@Override`.

```java
class Animal {
    void sound() {
    }
}

class Dog extends Animal {
    @Override
    void sound() {
    }
}
```

The practical value appears when code changes or a signature is mistyped:

```java
class Dog extends Animal {
    @Override
    void sounds() { // compile error: does not override the intended method
    }
}
```

Without `@Override`, `sounds()` could silently become an unrelated new method. The annotation converts an intention into a compiler-checked contract.

### BOUNDARY — `@Override` does not change dispatch

Overriding semantics come from Java's type system and method rules. `@Override` verifies the declaration; it does not make a method virtual or change runtime dispatch.

Java 21 also permits `@Override` on an explicitly declared accessor for a record component. That is a specific language rule in addition to the common superclass/interface overriding case.
