`BigInteger` does not overload arithmetic operators. Operations are methods that return new values:

```java
BigInteger a = BigInteger.TEN;

a.add(BigInteger.ONE); // result ignored
System.out.println(a); // 10

a = a.add(BigInteger.ONE);
System.out.println(a); // 11
```

Mental model:

```text
BigInteger object
→ value does not change

reference variable
→ may point to a new BigInteger object
```

Immutability simplifies reasoning and sharing, but long arithmetic chains can create intermediate objects.
