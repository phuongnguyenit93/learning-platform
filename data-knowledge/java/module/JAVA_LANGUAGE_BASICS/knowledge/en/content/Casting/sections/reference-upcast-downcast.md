Upcasting a subtype to a supertype is normally implicit:

```java
Dog dog = new Dog();
Animal animal = dog;
```

The object does not change; only the reference's static type becomes more general.

Downcasting is explicit and may require a runtime type check.

Reference casting does not transform the object itself:

```java
Animal animal = new Dog();
Dog dog = (Dog) animal;
```

No new object is created. The cast requests a different typed view after runtime compatibility is checked. Casting `null` to a reference type is valid and still produces `null`.
