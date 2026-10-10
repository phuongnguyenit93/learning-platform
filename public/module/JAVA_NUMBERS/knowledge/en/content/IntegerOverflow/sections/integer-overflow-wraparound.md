### WHAT

An `int` is a signed 32-bit integer:

```text
Integer.MIN_VALUE = -2^31
Integer.MAX_VALUE =  2^31 - 1
```

Arithmetic outside that range wraps:

```java
int value = Integer.MAX_VALUE;
value++;

System.out.println(value); // Integer.MIN_VALUE
```

### WHY is silent wraparound dangerous?

```text
valid input
    ↓
arithmetic overflow
    ↓
wrapped value is still a valid int
    ↓
business logic continues with the wrong value
```

If the value represents quantity, cents, counters, offsets, timeouts, or capacity, the visible failure may occur far from the arithmetic that caused it.

### HOW — focus on intermediate results

```java
int quantity = 1_000_000;
int unitPrice = 10_000;

long total = quantity * unitPrice;
```

The multiplication is still `int * int`. Assignment to `long` happens afterward.

Use a wider operand before the operation:

```java
long total = (long) quantity * unitPrice;
```

And `long` itself can overflow:

```java
long a = 3_000_000_000L;
long b = 4_000_000_000L;

long product = a * b;
```

Moving from `int` to `long` increases the range; it does not eliminate overflow.
