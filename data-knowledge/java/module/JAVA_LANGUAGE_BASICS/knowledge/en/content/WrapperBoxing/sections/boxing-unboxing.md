**Boxing** converts a primitive value to a wrapper; **unboxing** extracts the primitive value.

```java
Integer boxed = 10; // autoboxing
int value = boxed;  // unboxing
```

Autoboxing is convenient, but it does not make primitives and wrappers the same type. Overload resolution, `null`, identity, and performance can still differ.

Boxing/unboxing can be inserted implicitly in assignment, method invocation, and arithmetic contexts:

```java
Integer a = 10;
void accept(Integer x) { }
accept(10);

Integer count = 10;
int next = count + 1; // unboxing before arithmetic
```
