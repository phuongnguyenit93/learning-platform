```java
Animal animal = new Dog();
```

Here:

```text
declared / compile-time type
→ Animal

runtime object type
→ Dog
```

The compiler uses `Animal` for member availability, conversions, and overload rules. The runtime `Dog` type participates in dynamic dispatch for overridden instance methods.

Static type belongs to the expression/reference view:

```java
Animal animal = new Dog();
animal.eat();
// animal.bark(); // invalid if Animal does not declare bark
```

Even though the runtime object is a `Dog`, the compiler checks members through the static type of the expression. Runtime type does not cause overload resolution to be re-run.
