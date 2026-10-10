Keep the distinction:

```text
overload selection
→ compile time
→ method set + static argument types/conversions

override dispatch
→ runtime
→ runtime receiver type after a signature is selected
```

That is why one expression can choose an overload using a declared type while still executing a subclass override body at runtime.

Example:

```java
class Parent {
    void speak() { System.out.println("Parent"); }
}

class Child extends Parent {
    @Override
    void speak() { System.out.println("Child"); }
}

void use(Parent x) { x.speak(); }
void use(Object x) { System.out.println("Object"); }

Parent p = new Child();
use(p);
```

The compiler selects `use(Parent)` from the static type of `p`. Inside that method, runtime dispatch invokes `Child.speak()` because the actual receiver is a `Child`.
