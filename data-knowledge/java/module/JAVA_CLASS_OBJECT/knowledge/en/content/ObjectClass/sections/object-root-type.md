An `Object` reference can refer to an instance of any class:

```java
Object value = new BankAccount("A-01");
```

But the static type `Object` exposes only the `Object` contract. Accessing `BankAccount`-specific behavior requires appropriate type information/casting.

Primitives are not subtypes of `Object`; wrapper types let primitive values participate in reference-based APIs.
