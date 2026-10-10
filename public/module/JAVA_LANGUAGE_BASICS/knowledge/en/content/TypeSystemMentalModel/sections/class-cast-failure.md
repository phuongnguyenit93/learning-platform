If the runtime object is incompatible with the target type, the downcast fails:

```java
Animal animal = new Cat();
Dog dog = (Dog) animal; // ClassCastException
```

The compiler validates possible type relationships; runtime validates the actual object.

```text
compile time → is this cast relationship legal?
runtime      → is the actual object compatible?
```

If a cast is being added only to "make the compiler accept it," re-check the type model. A cast should express real knowledge about the runtime relationship.

These sections show why a cast can be legal as a type relationship while still requiring a runtime check of the actual object.
