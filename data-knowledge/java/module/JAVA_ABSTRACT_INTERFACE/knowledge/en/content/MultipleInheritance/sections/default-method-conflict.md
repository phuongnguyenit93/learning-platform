If two unrelated interfaces provide the same default signature:

```java
interface A {
    default String name() { return "A"; }
}

interface B {
    default String name() { return "B"; }
}
```

If no compatible concrete class-side method has already resolved this signature, a class implementing both must override `name()` and choose or combine behavior explicitly.

Java does not guess which default is intended when neither interface is more specific.

By contrast, when a child interface overrides a parent default, the child declaration is more specific:

```java
interface Parent {
    default String name() { return "parent"; }
}

interface Child extends Parent {
    @Override
    default String name() { return "child"; }
}
```

A class implementing `Child` does not choose again between `Parent.name()` and `Child.name()`; `Child` already supplies the more-specific behavior.

A conflict can also arise **inside the interface hierarchy itself**, before any class implements it. If a child interface inherits override-equivalent default methods from unrelated parent interfaces and neither parent is more specific, the child interface must declare an overriding method to resolve the conflict; otherwise the child-interface declaration is a compile-time error:

```java
interface Left {
    default String name() { return "left"; }
}

interface Right {
    default String name() { return "right"; }
}

interface Combined extends Left, Right {
    @Override
    default String name() {
        return Left.super.name();
    }
}
```

Resolving the conflict in the child interface makes the contract unambiguous before any class implements `Combined`.
