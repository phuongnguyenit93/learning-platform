### WHAT

A pseudo-random generator can be viewed as:

```text
seed / internal state
        ↓
deterministic algorithm
        ↓
sequence of values
```

The same seed and the same call sequence can reproduce the same outputs:

```java
Random a = new Random(42);
Random b = new Random(42);

System.out.println(a.nextInt(1000));
System.out.println(b.nextInt(1000));
```

### WHY is determinism useful?

For tests and simulations:

```text
random-looking data
        +
reproducible seed
        =
reproducible failures
```

A fixed seed makes it possible to reproduce the same sequence during debugging.

### Bounded random values

```java
int value = random.nextInt(100);
```

produces:

```text
0 <= value < 100
```

Prefer bounded APIs over manually applying modulo:

```java
random.nextInt() % 100
```

because manual modulo can produce negative results and distribution problems when handled incorrectly.
