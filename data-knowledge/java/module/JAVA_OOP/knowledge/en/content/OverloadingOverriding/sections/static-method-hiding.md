Static methods are type-level behavior and do not dispatch from the runtime receiver like instance methods.

```java
class Parent {
    static String call() { return "Parent"; }
}

class Child extends Parent {
    static String call() { return "Child"; }
}

Parent value = new Child();
value.call(); // Parent.call()
```

Selection follows the compile-time qualifying type `Parent`.

Calling static methods through instances may compile in some contexts but is misleading; prefer the class name so intent is explicit.

`super.someMethod()` explicitly selects the supertype implementation, so it is different from a normal virtual call through `this.someMethod()`. It is commonly used when an override extends rather than completely replaces parent behavior.
